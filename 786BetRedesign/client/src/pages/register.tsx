import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    agreedToTerms: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; referralCode?: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Welcome to 786Bet.casino! Please log in to continue.",
      });
      setLocation("/login");
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the Terms of Service to continue",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
      referralCode: formData.referralCode || undefined,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 hero-bg">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <Link href="/">
            <div className="flex items-center justify-center space-x-2 mb-6 cursor-pointer">
              <span className="text-3xl font-bold text-gold">786Bet</span>
              <span className="text-white text-xl">.casino</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold mb-2 tracking-wide">Create Account</h2>
          <p className="text-gray-400">Join the winning team</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="reg-email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </Label>
            <Input
              type="email"
              id="reg-email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <Label htmlFor="reg-password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </Label>
            <Input
              type="password"
              id="reg-password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="Create password"
            />
          </div>
          
          <div>
            <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirm-password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="Confirm password"
            />
          </div>
          
          <div>
            <Label htmlFor="referral" className="block text-sm font-medium text-gray-300 mb-2">
              Referral Code (Optional)
            </Label>
            <Input
              type="text"
              id="referral"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="Enter referral code"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreedToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: !!checked })}
            />
            <Label htmlFor="terms" className="text-sm text-gray-400">
              I agree to the{" "}
              <a href="#" className="text-gold hover:text-emerald">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-gold hover:text-emerald">Privacy Policy</a>
            </Label>
          </div>
          
          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-2xl bg-gold hover:bg-emerald text-black font-bold px-6 py-3 shadow-md transition-all duration-300"
          >
            {registerMutation.isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        
        <div className="text-center">
          <span className="text-gray-400">Already have an account? </span>
          <Link href="/login">
            <a className="text-gold hover:text-emerald transition-colors duration-300 font-medium">
              Sign in
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
