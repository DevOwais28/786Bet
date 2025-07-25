import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { Ban, Check, X, Settings, Users, CreditCard, Menu } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isBanned: boolean;
  createdAt: string;
}

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  walletAddress: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    username: string;
  };
}

interface GameSettings {
  crashPoint: number;
  multiplier: number;
}

const AdminSidebar = ({ activeSection, setActiveSection }: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) => (
  <div className="w-64 h-full bg-gray-800 text-white p-4 flex flex-col flex-shrink-0">
    <h1 className="text-2xl font-bold text-yellow-500 mb-8">Admin Panel</h1>
    <nav className="flex-1 space-y-2">
      <button 
        onClick={() => setActiveSection('users')} 
        className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          activeSection === 'users' ? 'bg-yellow-500/20 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <Users size={20} /> <span>User Management</span>
      </button>
      <button 
        onClick={() => setActiveSection('withdrawals')} 
        className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          activeSection === 'withdrawals' ? 'bg-yellow-500/20 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <CreditCard size={20} /> <span>Withdrawals</span>
      </button>
      <button 
        onClick={() => setActiveSection('game-control')} 
        className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          activeSection === 'game-control' ? 'bg-yellow-500/20 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <Settings size={20} /> <span>Game Control</span>
      </button>
    </nav>
  </div>
);

export default function Admin() {
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({ 
    queryKey: ["/api/admin/users"], 
    queryFn: () => api.get("/api/admin/users").then(res => res.data) 
  });

  const { data: pendingWithdrawals = [], isLoading: withdrawalsLoading } = useQuery<Withdrawal[]>({ 
    queryKey: ["/api/admin/withdrawals/pending"], 
    queryFn: () => api.get("/api/admin/withdrawals/pending").then(res => res.data) 
  });

  const { data: gameSettings, isLoading: gameSettingsLoading } = useQuery<GameSettings>({ 
    queryKey: ["/api/admin/settings/game"], 
    queryFn: () => api.get("/api/admin/settings/game").then(res => res.data) 
  });

  const withdrawalMutation = useMutation({
    mutationFn: ({ id, approve }: { id: string, approve: boolean }) => 
      api.post(`/api/admin/withdrawals/${id}/status`, { approve }),
    onSuccess: () => {
      toast.success("Withdrawal status updated!");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals/pending"] });
    },
    onError: (err: Error) => toast.error(`Error: ${err.message}`)
  });

  const banUserMutation = useMutation({
    mutationFn: (userId: string) => api.post(`/api/admin/users/${userId}/ban`),
    onSuccess: () => {
      toast.success("User ban status updated!");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (err: Error) => toast.error(`Error: ${err.message}`)
  });

  const updateGameSettingsMutation = useMutation({
    mutationFn: (settings: Partial<GameSettings>) => api.put("/api/admin/settings/game", settings),
    onSuccess: () => {
      toast.success("Game settings updated!");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/game"] });
    },
    onError: (err: Error) => toast.error(`Error: ${err.message}`)
  });

  const handleUpdateGameSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const crashPoint = parseFloat(formData.get('crashPoint') as string);
    const multiplier = parseFloat(formData.get('multiplier') as string);
    updateGameSettingsMutation.mutate({ crashPoint, multiplier });
  };

  const renderUsers = () => {
    if (usersLoading) return <div className="p-6 text-center">Loading Users...</div>;
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4 text-white">User Management</h2>
        <div className="overflow-x-auto bg-gray-800/50 rounded-lg">
          <table className="min-w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-700/50">
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">${user.balance.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.isBanned ? 'bg-red-500/50' : 'bg-green-500/50'
                    }`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => banUserMutation.mutate(user.id)} 
                      className="p-2 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={user.isBanned}
                    >
                      <Ban size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWithdrawals = () => {
    if (withdrawalsLoading) return <div className="p-6 text-center">Loading Withdrawals...</div>;
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4 text-white">Withdrawal Requests</h2>
        <div className="overflow-x-auto bg-gray-800/50 rounded-lg">
          <table className="min-w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Wallet</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingWithdrawals.map(withdrawal => (
                <tr key={withdrawal.id} className="border-b border-gray-800 hover:bg-gray-700/50">
                  <td className="p-4">{withdrawal.user.username}</td>
                  <td className="p-4">${withdrawal.amount.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-400">{withdrawal.walletAddress.slice(0, 6)}...{withdrawal.walletAddress.slice(-4)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      withdrawal.status === 'APPROVED' ? 'bg-green-500/50' : 
                      withdrawal.status === 'REJECTED' ? 'bg-red-500/50' : 'bg-yellow-500/50'
                    }`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {withdrawal.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => withdrawalMutation.mutate({ id: withdrawal.id, approve: true })}
                          className="p-2 rounded-full bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => withdrawalMutation.mutate({ id: withdrawal.id, approve: false })}
                          className="p-2 rounded-full bg-red-600 hover:bg-red-700"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGameControl = () => {
    if (gameSettingsLoading) return <div className="p-6 text-center">Loading Game Settings...</div>;
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4 text-white">Game Control</h2>
        <form onSubmit={handleUpdateGameSettings} className="bg-gray-800/50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Crash Point</label>
              <input
                name="crashPoint"
                type="number"
                step="0.01"
                defaultValue={gameSettings?.crashPoint}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Multiplier</label>
              <input
                name="multiplier"
                type="number"
                step="0.01"
                defaultValue={gameSettings?.multiplier}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button 
              type="submit" 
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-gray-800/80 backdrop-blur-md z-20 flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-yellow-500">Admin Panel</h1>
          <button onClick={toggleSidebar} className="text-white">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeSection === "users" && renderUsers()}
          {activeSection === "withdrawals" && renderWithdrawals()}
          {activeSection === "game-control" && renderGameControl()}
        </main>
      </div>
    </div>
  );
}