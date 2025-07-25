import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BetPanelProps {
  gameState: 'waiting' | 'flying' | 'crashed';
  onBetPlaced: (amount: number) => void;
  onCashOut: () => void;
  balance: number;
  currentMultiplier: number;
  isBetting: boolean;
  hasCashedOut: boolean;
}

export default function BetPanel({
  gameState,
  onBetPlaced,
  onCashOut,
  balance,
  currentMultiplier,
  isBetting,
  hasCashedOut
}: BetPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState("");
  const [autoCashOut, setAutoCashOut] = useState("");
  const [currentBet, setCurrentBet] = useState<{ id: string; amount: number; currentMultiplier?: number; autoCashOut?: number } | null>(null);

  const { data: userProfile } = useQuery<{
    balance: number;
  }>({
    queryKey: ["/api/user/profile"],
  });

  const placeBetMutation = useMutation({
    mutationFn: async (data: { amount: number; autoCashOut?: number }) => {
      const response = await apiRequest("POST", "/api/game/bet", data);
      return response.json();
    },
    onSuccess: (data: { id: string; amount: number }) => {
      setCurrentBet(data);
      toast({
        title: "Bet placed",
        description: `Bet of $${betAmount} placed successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error) => {
      toast({
        title: "Bet failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cashOutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/game/cashout", { betId: currentBet!.id });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cashed out!",
        description: `Successfully cashed out at ${currentBet?.currentMultiplier || currentMultiplier}x`,
      });
      setCurrentBet(null);
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error) => {
      toast({
        title: "Cash out failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlaceBet = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(betAmount);
    const auto = autoCashOut ? parseFloat(autoCashOut) : undefined;
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    placeBetMutation.mutate({ amount, autoCashOut: auto });
  };

  const setBetAmountQuick = (amount: number) => {
    setBetAmount(amount.toString());
  };

  return (
    <div className="w-80 bg-gray-900 p-6 border-l border-gray-800">
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Place Your Bet</h3>
        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">Balance</div>
          <div className="text-2xl font-bold text-gold">
            ${userProfile?.balance?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      {/* Bet Form */}
      <form onSubmit={handlePlaceBet} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-300 mb-2">Bet Amount</Label>
          <div className="relative">
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="0.00"
              min="1"
              step="0.01"
            />
            <span className="absolute right-3 top-3 text-gray-400">USD</span>
          </div>
        </div>

        {/* Quick Bet Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button type="button" onClick={() => setBetAmountQuick(10)} className="bg-gray-700 hover:bg-gold hover:text-black px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm">
            $10
          </Button>
          <Button type="button" onClick={() => setBetAmountQuick(25)} className="bg-gray-700 hover:bg-gold hover:text-black px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm">
            $25
          </Button>
          <Button type="button" onClick={() => setBetAmountQuick(50)} className="bg-gray-700 hover:bg-gold hover:text-black px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm">
            $50
          </Button>
          <Button type="button" onClick={() => setBetAmountQuick(100)} className="bg-gray-700 hover:bg-gold hover:text-black px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm">
            $100
          </Button>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-300 mb-2">Auto Cash Out</Label>
          <div className="relative">
            <Input
              type="number"
              value={currentBet?.autoCashOut || ""}
              onChange={(e) => setCurrentBet({ ...currentBet!, autoCashOut: parseFloat(e.target.value) || 0 })}
              disabled={isBetting}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="2.00"
              min="1.01"
              step="0.01"
            />
            <span className="absolute right-3 top-3 text-gray-400">x</span>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={placeBetMutation.isPending || !!currentBet}
          className="w-full rounded-2xl bg-gold hover:bg-emerald text-black font-bold px-6 py-4 shadow-md transition-all duration-300 text-lg"
        >
          {currentBet ? "Bet Active" : "Place Bet"}
        </Button>
      </form>

      {/* Current Bet Status */}
      {currentBet && (
        <div className="mt-6 bg-gray-800 p-4 rounded-xl">
          <h4 className="font-medium mb-3">Current Bet</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span>${currentBet.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Auto Cash Out:</span>
              <span>{currentBet.autoCashOut ? `${currentBet.autoCashOut}x` : "Manual"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potential Win:</span>
              <span className="text-sm font-medium">Current: {currentBet?.currentMultiplier || currentMultiplier}x</span>
            </div>
          </div>
          <Button 
            onClick={() => cashOutMutation.mutate()}
            disabled={cashOutMutation.isPending}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300"
          >
            Cash Out Now
          </Button>
        </div>
      )}
    </div>
  );
}
