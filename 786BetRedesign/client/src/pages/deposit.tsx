import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Smartphone, Building2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const DepositForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScreenshotUpload, setShowScreenshotUpload] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);

  const { data: userProfile } = useQuery<{
    balance: number;
  }>({
    queryKey: ["/api/user/profile"],
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (data: { amount: number }) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", data);
      return response.json() as Promise<{ clientSecret: string }>;
    },
  });

  const handleScreenshotUpload = async () => {
    if (!screenshotFile) {
      toast({
        title: "No file selected",
        description: "Please select a screenshot to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingScreenshot(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);
      formData.append('amount', amount);
      formData.append('paymentMethod', paymentMethod);

      await fetch("/api/upload-deposit-screenshot", {
        method: "POST",
        body: formData,
      });

      toast({
        title: "Screenshot uploaded!",
        description: "Your deposit will be processed shortly",
      });

      setScreenshotFile(null);
      setScreenshotPreview(null);
      setShowScreenshotUpload(false);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload screenshot",
        variant: "destructive",
      });
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast({
        title: "Payment system not ready",
        description: "Please wait a moment and try again",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount < 10) {
      toast({
        title: "Invalid amount",
        description: "Minimum deposit amount is $10",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntentMutation.mutateAsync({
        amount: depositAmount,
      });

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message || "Payment failed");
      }

      if (paymentIntent.status === "succeeded") {
        // Update user balance
        await apiRequest("POST", "/api/user/deposit", {
          amount: depositAmount,
          method: paymentMethod,
          stripePaymentIntentId: paymentIntent.id,
        });

        toast({
          title: "Deposit successful!",
          description: `Please upload a screenshot of your payment as proof`,
        });

        // Show screenshot upload section
        setShowScreenshotUpload(true);
        
        // Refresh user profile
        queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
        setAmount("");
      }
    } catch (error: any) {
      toast({
        title: "Deposit failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Deposit Funds</h1>
          <p className="text-gray-400">Add money to your casino account securely</p>
          <div className="mt-4 p-4 bg-gray-700 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Current Balance</div>
            <div className="text-2xl font-bold text-gold">
              ${userProfile?.balance || "0.00"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-3">
              Deposit Amount (USD)
            </Label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`bg-gray-700 hover:bg-gold hover:text-black transition-all duration-300 ${
                    amount === quickAmount.toString() ? "bg-gold text-black" : ""
                  }`}
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="Enter custom amount"
              min="10"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-400 mt-2">Minimum deposit: $10</p>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-3">
              Payment Method
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Credit/Debit Card</span>
                  </div>
                </SelectItem>
                {/* <SelectItem value="jazzcash"> */}
                  {/* <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>JazzCash</span>
                  </div>
                </SelectItem>
                <SelectItem value="easypaisa">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>EasyPaisa</span>
                  </div>
                </SelectItem> */}
                <SelectItem value="bank-transfer">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Card Details */}
          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-3">
              Card Details
            </Label>
            <div className="p-4 bg-gray-700 border border-gray-600 rounded-xl">
              <CardElement
                options={{
                  style: {
                    base: {
                      color: "#ffffff",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      "::placeholder": {
                        color: "#9ca3af",
                      },
                    },
                    invalid: {
                      color: "#ef4444",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-emerald/10 border border-emerald/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-emerald">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Your payment is secured with 256-bit SSL encryption. We never store your card details.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing || !stripe || !amount}
            className="w-full rounded-2xl bg-gold hover:bg-emerald text-black font-bold px-6 py-4 shadow-md transition-all duration-300 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="loading-spinner w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Deposit $${amount || "0"}`
            )}
          </Button>
        </form>

        {/* Payment Methods Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            We accept Visa, Mastercard, and local payment methods
          </p>
          <div className="flex justify-center items-center space-x-4 mt-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 opacity-70" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-70" />
          </div>
        </div>
      </div>

      {/* Screenshot Upload Section */}
      {showScreenshotUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upload Payment Screenshot</h3>
              <p className="text-gray-300">Please provide proof of your payment</p>
            </div>

            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-gold/50 transition-all duration-300 cursor-pointer bg-gray-800/50 backdrop-blur-sm"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('screenshot-input')?.click()}
              >
                <input
                  id="screenshot-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {screenshotPreview ? (
                  <div className="space-y-4">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="max-w-full h-48 object-contain rounded-xl mx-auto"
                    />
                    <p className="text-sm text-gray-300">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Drag & drop or click to upload</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleScreenshotUpload}
                  disabled={!screenshotFile || isUploadingScreenshot}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-gold to-yellow-500 hover:from-emerald hover:to-green-500 text-black font-bold px-6 py-3 shadow-xl transition-all duration-300"
                >
                  {isUploadingScreenshot ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Screenshot"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowScreenshotUpload(false);
                    setScreenshotFile(null);
                    setScreenshotPreview(null);
                  }}
                  variant="outline"
                  className="rounded-2xl border-2 border-gray-600 hover:border-gray-500 text-gray-300 font-bold px-6 py-3 transition-all duration-300"
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Deposit() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Elements stripe={stripePromise}>
        <DepositForm />
      </Elements>
    </div>
  );
}