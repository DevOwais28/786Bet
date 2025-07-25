import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Shield, 
  Activity,
  Eye,
  EyeOff,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
}

interface GameSettings {
  isGameActive: boolean;
  minBet: number;
  maxBet: number;
  houseEdge: number;
  crashProbability: number;
  roundDuration: number;
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    isGameActive: true,
    minBet: 1,
    maxBet: 1000,
    houseEdge: 0.03,
    crashProbability: 0.9,
    roundDuration: 5000,
  });

  // Fetch admin stats
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  // Fetch recent transactions
  const { data: transactions } = useQuery({
    queryKey: ['/api/admin/transactions'],
  });

  // Fetch pending deposits
  const { data: pendingDeposits } = useQuery({
    queryKey: ['/api/admin/pending-deposits'],
  });

  // Fetch pending withdrawals
  const { data: pendingWithdrawals } = useQuery({
    queryKey: ['/api/admin/pending-withdrawals'],
  });

  const handleGameToggle = () => {
    setGameSettings(prev => ({ ...prev, isGameActive: !prev.isGameActive }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'game', label: 'Game Control', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="bg-emerald/20 text-emerald px-3 py-1 rounded-full text-sm font-medium">
                Online
              </div>
              <Button 
                variant="outline" 
                className="text-red border-red hover:bg-red hover:text-black"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-4 mb-6 border border-white/10">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-gold to-yellow-500 text-black font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="w-8 h-8 text-gold" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Daily Profit</p>
                  <p className="text-2xl font-bold text-emerald">${stats?.dailyProfit || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Deposits</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats?.pendingDeposits || 0}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Withdrawals</p>
                  <p className="text-2xl font-bold text-red">{stats?.pendingWithdrawals || 0}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-red" />
              </div>
            </Card>
          </div>
        )}

        {/* Game Control Tab */}
        {selectedTab === 'game' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Game Control</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Game Status</span>
                  <div className="flex items-center space-x-2">
                    {gameSettings.isGameActive ? (
                      <>
                        <Play className="w-4 h-4 text-emerald" />
                        <span className="text-emerald font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 text-red" />
                        <span className="text-red font-medium">Paused</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleGameToggle}
                  className={`w-full rounded-2xl font-bold ${
                    gameSettings.isGameActive
                      ? 'bg-gradient-to-r from-red to-red/80 text-white hover:from-red/80 hover:to-red'
                      : 'bg-gradient-to-r from-emerald to-green-500 text-black hover:from-green-500 hover:to-emerald'
                  }`}
                >
                  {gameSettings.isGameActive ? 'Pause Game' : 'Resume Game'}
                </Button>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Game Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Bet</label>
                  <Input
                    type="number"
                    value={gameSettings.minBet}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, minBet: parseFloat(e.target.value) }))}
                    className="bg-gray-700/50 border-gray-600 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Bet</label>
                  <Input
                    type="number"
                    value={gameSettings.maxBet}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, maxBet: parseFloat(e.target.value) }))}
                    className="bg-gray-700/50 border-gray-600 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">House Edge (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={gameSettings.houseEdge * 100}
                    onChange={(e) => setGameSettings(prev => ({ ...prev, houseEdge: parseFloat(e.target.value) / 100 }))}
                    className="bg-gray-700/50 border-gray-600 rounded-xl"
                  />
                </div>

                <Button className="w-full rounded-2xl bg-gradient-to-r from-gold to-yellow-500 text-black font-bold">
                  Save Settings
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">User Management</h3>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">User management interface coming soon...</p>
            </div>
          </Card>
        )}

        {/* Transactions Tab */}
        {selectedTab === 'transactions' && (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Transaction Management</h3>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Transaction management interface coming soon...</p>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {selectedTab === 'security' && (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Security Settings</h3>
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Security settings interface coming soon...</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
