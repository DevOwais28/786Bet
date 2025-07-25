import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, TrendingUp, Gamepad2, Copy, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { toast } = useToast();

  const { data: userProfile } = useQuery<{
    username: string;
    balance: number;
    referralCode?: string;
    totalWinnings: number;
    gamesPlayed: number;
    referralEarnings: number;
    totalReferrals: number;
    activeReferrals: number;
  }>({
    queryKey: ["/api/user/profile"],
  });

  const { data: gameHistory } = useQuery<any[]>({
    queryKey: ["/api/user/history"],
  });

  const copyReferralCode = () => {
    if (userProfile?.referralCode) {
      navigator.clipboard.writeText(userProfile.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const renderOverview = () => (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black mb-3 tracking-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-400">{userProfile?.username || "Player"}</span>!
        </h1>
        <p className="text-gray-300/90 text-lg font-light">Here's what's happening with your account today.</p>
      </div>

      {/* Balance Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gold via-yellow-500 to-amber-400 p-8 rounded-3xl text-black shadow-2xl shadow-gold/25 transform hover:scale-105 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black/70 text-sm font-semibold uppercase tracking-wide">Current Balance</p>
              <p className="text-4xl font-black">${userProfile?.balance?.toFixed(2) || "0.00"}</p>
            </div>
            <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300/70 text-sm font-semibold uppercase tracking-wide">Total Winnings</p>
              <p className="text-3xl font-black text-emerald">${userProfile?.totalWinnings?.toFixed(2) || "0.00"}</p>
            </div>
            <div className="w-16 h-16 bg-emerald/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-emerald" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300/70 text-sm font-semibold uppercase tracking-wide">Games Played</p>
              <p className="text-3xl font-black">{userProfile?.gamesPlayed || 0}</p>
            </div>
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Gamepad2 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 tracking-tight">Quick Deposit</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="bg-gray-700 hover:bg-gold hover:text-black transition-all duration-300">
                $50
              </Button>
              <Button variant="outline" className="bg-gray-700 hover:bg-gold hover:text-black transition-all duration-300">
                $100
              </Button>
              <Button variant="outline" className="bg-gray-700 hover:bg-gold hover:text-black transition-all duration-300">
                $250
              </Button>
            </div>
            <div className="flex space-x-2">
              <Link href="/deposit" className="flex-1">
                <Button className="w-full rounded-2xl bg-gradient-to-r from-gold to-yellow-500 hover:from-emerald hover:to-green-500 text-black font-bold px-6 py-3 shadow-xl hover:shadow-gold/25 transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </Link>
              <Link href="/withdraw" className="flex-1">
                <Button className="w-full rounded-2xl bg-emerald hover:bg-green-600 text-white font-bold px-6 py-3 shadow-md transition-all duration-300">
                  <Minus className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-3">
            {gameHistory?.slice(0, 3).map((game: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400">Aviator Game</span>
                <span className={`font-medium ${game.payout > 0 ? "text-emerald" : "text-red-400"}`}>
                  {game.payout > 0 ? "+" : ""}${game.payout.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black mb-3 tracking-tight">Wallet Management</h1>
        <p className="text-gray-300/90 text-lg font-light">Manage your deposits and withdrawals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit */}
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-2xl font-medium mb-6">Deposit Funds</h3>
          <form className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</Label>
              <Input
                type="number"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                placeholder="Enter amount"
                min="10"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</Label>
              <Select>
                <SelectTrigger className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full rounded-2xl bg-gold hover:bg-emerald text-black font-bold px-6 py-3 shadow-md transition-all duration-300">
              Deposit Now
            </Button>
          </form>
        </div>

        {/* Withdraw */}
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-2xl font-medium mb-6">Withdraw Funds</h3>
          <form className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</Label>
              <Input
                type="number"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                placeholder="Enter amount"
                min="10"
              />
              <p className="text-sm text-gray-400 mt-1">
                Available: ${userProfile?.balance?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Method</Label>
              <Select>
                <SelectTrigger className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white">
                  <SelectValue placeholder="Select withdrawal method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-account">Bank Account</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full rounded-2xl bg-emerald hover:bg-green-600 text-white font-bold px-6 py-3 shadow-md transition-all duration-300">
              Request Withdrawal
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black mb-3 tracking-tight">Game History</h1>
        <p className="text-gray-300/90 text-lg font-light">Track your gaming performance</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Game</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Bet Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Multiplier</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Payout</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {gameHistory?.map((game: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm">Aviator</td>
                  <td className="px-6 py-4 text-sm">${game.betAmount.toFixed(2)}</td>
                  <td className={`px-6 py-4 text-sm ${game.multiplier >= 1 ? "text-emerald" : "text-red-400"}`}>
                    {game.multiplier.toFixed(2)}x
                  </td>
                  <td className={`px-6 py-4 text-sm ${game.payout > 0 ? "text-emerald" : "text-red-400"}`}>
                    {game.payout > 0 ? "+" : ""}${game.payout.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{game.timeAgo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReferral = () => (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black mb-3 tracking-tight">Referral Program</h1>
        <p className="text-gray-300/90 text-lg font-light">Earn bonuses by inviting friends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 tracking-tight">Your Referral Code</h3>
          <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-between border border-white/10">
            <span className="text-2xl font-bold text-gold">
              {userProfile?.referralCode || "LOADING..."}
            </span>
            <Button
              onClick={copyReferralCode}
              className="rounded-xl bg-gradient-to-r from-gold to-yellow-500 hover:from-emerald hover:to-green-500 text-black font-bold px-6 py-3 transition-all duration-300 shadow-lg"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-gray-400 mt-4 text-sm">
            Share this code with friends to earn 10% of their first deposit!
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 tracking-tight">Referral Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Referrals</span>
              <span className="font-medium">{userProfile?.totalReferrals || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Referrals</span>
              <span className="font-medium">{userProfile?.activeReferrals || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Earned</span>
              <span className="font-medium text-emerald">
                ${userProfile?.referralEarnings?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "wallet":
        return renderWallet();
      case "history":
        return renderHistory();
      case "referral":
        return renderReferral();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex">
      <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50 backdrop-blur-sm">
        {renderContent()}
      </div>
    </div>
  );
}
