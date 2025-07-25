import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, TrendingUp, Gamepad2, Copy, Plus, Minus, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const renderOverview = () => (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">{userProfile?.username || "Player"}</span>!
        </h1>
        <p className="text-gray-400 text-base sm:text-lg font-light">Here's what's happening with your account today.</p>
      </div>

      {/* Balance Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-black shadow-2xl shadow-yellow-400/25 transform hover:scale-105 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black/70 text-xs sm:text-sm font-semibold uppercase tracking-wide">Current Balance</p>
              <p className="text-3xl sm:text-4xl font-black">${userProfile?.balance?.toFixed(2) || "0.00"}</p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300/70 text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Winnings</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">${userProfile?.totalWinnings?.toFixed(2) || "0.00"}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300/70 text-xs sm:text-sm font-semibold uppercase tracking-wide">Games Played</p>
              <p className="text-2xl sm:text-3xl font-black">{userProfile?.gamesPlayed || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Gamepad2 className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight">Quick Actions</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="bg-gray-700 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-xs sm:text-sm">$50</Button>
              <Button variant="outline" className="bg-gray-700 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-xs sm:text-sm">$100</Button>
              <Button variant="outline" className="bg-gray-700 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-xs sm:text-sm">$250</Button>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Link href="/deposit" className="flex-1">
                <Button className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-emerald-500 hover:to-green-500 text-black font-bold px-6 py-3 shadow-lg hover:shadow-yellow-400/25 transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </Link>
              <Link href="/withdraw" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl bg-gray-700 border-gray-600 hover:bg-emerald-500 hover:text-white font-bold px-6 py-3 shadow-md transition-all duration-300">
                  <Minus className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight">Recent Activity</h3>
          <div className="space-y-3">
            {gameHistory?.slice(0, 3).map((game: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-gray-400">Aviator Game</span>
                <span className={`font-medium ${game.payout > 0 ? "text-emerald-400" : "text-red-400"}`}>
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
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">Wallet Management</h1>
        <p className="text-gray-400 text-base sm:text-lg font-light">Manage your deposits and withdrawals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-medium mb-6">Deposit Funds</h3>
          <form className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</Label>
              <Input type="number" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300" placeholder="Enter amount" min="10" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</Label>
              <Select>
                <SelectTrigger className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"><SelectValue placeholder="Select payment method" /></SelectTrigger>
                <SelectContent><SelectItem value="credit-card">Credit Card</SelectItem><SelectItem value="bank-transfer">Bank Transfer</SelectItem><SelectItem value="crypto">Cryptocurrency</SelectItem></SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 shadow-md transition-all duration-300">Deposit Now</Button>
          </form>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-medium mb-6">Withdraw Funds</h3>
          <form className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</Label>
              <Input type="number" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300" placeholder="Enter amount" min="10" />
              <p className="text-sm text-gray-400 mt-1">Available: ${userProfile?.balance?.toFixed(2) || "0.00"}</p>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Method</Label>
              <Select>
                <SelectTrigger className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"><SelectValue placeholder="Select withdrawal method" /></SelectTrigger>
                <SelectContent><SelectItem value="bank-account">Bank Account</SelectItem><SelectItem value="paypal">PayPal</SelectItem><SelectItem value="crypto">Cryptocurrency</SelectItem></SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 shadow-md transition-all duration-300">Request Withdrawal</Button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">Game History</h1>
        <p className="text-gray-400 text-base sm:text-lg font-light">Track your gaming performance</p>
      </div>

      {/* Responsive History: Table on desktop, Cards on mobile */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-4 font-medium">Game</th>
                <th className="p-4 font-medium">Bet Amount</th>
                <th className="p-4 font-medium">Multiplier</th>
                <th className="p-4 font-medium">Payout</th>
                <th className="p-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {gameHistory?.map((game: any, index: number) => (
                <tr key={index} className="hover:bg-gray-700/40">
                  <td className="p-4">Aviator</td>
                  <td className="p-4">${game.betAmount.toFixed(2)}</td>
                  <td className={`p-4 ${game.multiplier >= 1 ? "text-emerald-400" : "text-red-400"}`}>{game.multiplier.toFixed(2)}x</td>
                  <td className={`p-4 ${game.payout > 0 ? "text-emerald-400" : "text-red-400"}`}>{game.payout > 0 ? "+" : ""}${game.payout.toFixed(2)}</td>
                  <td className="p-4 text-gray-400">{game.timeAgo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {gameHistory?.map((game: any, index: number) => (
            <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Aviator</span>
                <span className={`font-bold text-lg ${game.payout > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {game.payout > 0 ? "+" : ""}${game.payout.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Bet: ${game.betAmount.toFixed(2)}</p>
                <p>Multiplier: <span className={`${game.multiplier >= 1 ? "text-emerald-400" : "text-red-400"}`}>{game.multiplier.toFixed(2)}x</span></p>
                <p>Time: {game.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReferral = () => (
    <div className="space-y-8 sm:space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">Referral Program</h1>
        <p className="text-gray-400 text-base sm:text-lg font-light">Earn bonuses by inviting friends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight">Your Referral Code</h3>
          <div className="bg-gray-700/50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between border border-white/10 gap-4">
            <span className="text-xl sm:text-2xl font-bold text-yellow-400">
              {userProfile?.referralCode || "LOADING..."}
            </span>
            <Button onClick={copyReferralCode} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-emerald-500 hover:to-green-500 text-black font-bold px-6 py-3 transition-all duration-300 shadow-lg">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-gray-400 mt-4 text-xs sm:text-sm">Share this code with friends to earn 10% of their first deposit!</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight">Referral Stats</h3>
          <div className="space-y-4 text-sm sm:text-base">
            <div className="flex justify-between"><span className="text-gray-400">Total Referrals</span><span className="font-medium">{userProfile?.totalReferrals || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Active Referrals</span><span className="font-medium">{userProfile?.activeReferrals || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Earned</span><span className="font-medium text-emerald-400">${userProfile?.referralEarnings?.toFixed(2) || "0.00"}</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "wallet": return renderWallet();
      case "history": return renderHistory();
      case "referral": return renderReferral();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden lg:block lg:w-64 h-screen sticky top-0">
          <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>

        {/* Mobile Sidebar (slide-in) */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
          <DashboardSidebar activeSection={activeSection} setActiveSection={(section) => { setActiveSection(section); setSidebarOpen(false); }} />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={toggleSidebar}></div>
        )}

        <div className="flex-1">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 bg-gray-900/80 backdrop-blur-sm z-30 p-4 flex items-center justify-between border-b border-gray-800">
            <Link href="/">
              <span className="text-xl font-bold text-yellow-400">786Bet</span>
            </Link>
            <button onClick={toggleSidebar} className="p-2">
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>

          {/* Main Content */}
          <main className="p-4 sm:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
