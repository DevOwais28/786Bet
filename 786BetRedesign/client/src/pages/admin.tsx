import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  status: string;
  createdAt: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface GameSettings {
  aviatorRtp: string;
  maxMultiplier: number;
  minBet: string;
  maxBet: string;
  referrerBonus: string;
  refereeBonus: string;
  minDepositForBonus: string;
  referralActive: boolean;
}

export default function Admin() {
  const [activeSection, setActiveSection] = useState("users");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: pendingWithdrawals = [] } = useQuery<Withdrawal[]>({
    queryKey: ["/api/admin/withdrawals/pending"],
  });

  const { data: gameSettings } = useQuery<GameSettings>({
    queryKey: ["/api/admin/settings/game"],
  });

  const approveWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalId: string) => {
      const response = await apiRequest("POST", `/api/admin/withdrawals/${withdrawalId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal approved",
        description: "The withdrawal has been processed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals/pending"] });
    },
  });

  const rejectWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalId: string) => {
      const response = await apiRequest("POST", `/api/admin/withdrawals/${withdrawalId}/reject`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal rejected",
        description: "The withdrawal has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals/pending"] });
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/ban`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User banned",
        description: "The user has been banned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const renderUsers = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-gray-400">Manage user accounts and activities</p>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-gold mb-2">{users.length}</div>
          <div className="text-gray-400 text-sm">Total Users</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-emerald mb-2">
            {users.filter((u: any) => u.status === "active").length}
          </div>
          <div className="text-gray-400 text-sm">Active Users</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {users.filter((u: any) => {
              const today = new Date().toDateString();
              return new Date(u.createdAt).toDateString() === today;
            }).length}
          </div>
          <div className="text-gray-400 text-sm">New Today</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-red-500 mb-2">
            {users.filter((u: any) => u.status === "banned").length}
          </div>
          <div className="text-gray-400 text-sm">Banned Users</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">User List</h3>
            <div className="flex space-x-4">
              <Input
                type="text"
                placeholder="Search users..."
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              <Select>
                <SelectTrigger className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user: any) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 text-sm">${user.balance?.toFixed(2) || "0.00"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "active" ? "bg-emerald/20 text-emerald" : 
                      user.status === "banned" ? "bg-red-500/20 text-red-500" :
                      "bg-gray-500/20 text-gray-500"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs transition-all duration-300">
                        View
                      </Button>
                      {user.status !== "banned" && (
                        <Button 
                          size="sm" 
                          onClick={() => banUserMutation.mutate(user.id)}
                          disabled={banUserMutation.isPending}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-all duration-300"
                        >
                          Ban
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial Management</h1>
        <p className="text-gray-400">Monitor transactions and approve withdrawals</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-emerald mb-2">$45,678</div>
          <div className="text-gray-400 text-sm">Total Deposits</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-red-500 mb-2">$23,456</div>
          <div className="text-gray-400 text-sm">Total Withdrawals</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-gold mb-2">$22,222</div>
          <div className="text-gray-400 text-sm">Net Profit</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <div className="text-3xl font-bold text-blue-500 mb-2">{pendingWithdrawals.length}</div>
          <div className="text-gray-400 text-sm">Pending Withdrawals</div>
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-medium">Pending Withdrawals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Method</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Requested</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pendingWithdrawals.map((withdrawal: any) => (
                <tr key={withdrawal.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {withdrawal.user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{withdrawal.user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">${withdrawal.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{withdrawal.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{withdrawal.timeAgo}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => approveWithdrawalMutation.mutate(withdrawal.id)}
                        disabled={approveWithdrawalMutation.isPending}
                        className="bg-emerald hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => rejectWithdrawalMutation.mutate(withdrawal.id)}
                        disabled={rejectWithdrawalMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGameControl = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Game Control Settings</h1>
        <p className="text-gray-400">Configure game parameters and bonuses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RTP Settings */}
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl font-medium mb-6">RTP Settings</h3>
          <form className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Aviator RTP (%)</Label>
              <Input
                type="number"
                defaultValue={gameSettings?.aviatorRtp || 97}
                min="90"
                max="99"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Max Multiplier</Label>
              <Input
                type="number"
                defaultValue={gameSettings?.maxMultiplier || 1000}
                min="10"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Min Bet (USD)</Label>
              <Input
                type="number"
                defaultValue={gameSettings?.minBet || 1}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Max Bet (USD)</Label>
              <Input
                type="number"
                defaultValue={gameSettings?.maxBet || 1000}
                min="1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              />
            </div>
            <Button type="submit" className="w-full rounded-2xl bg-gold hover:bg-emerald text-black font-bold px-6 py-3 shadow-md transition-all duration-300">
              Update Settings
            </Button>
          </form>
        </div>

        {/* Referral Settings */}
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="text-xl font-medium mb-6">Referral Bonuses</h3>
          <form className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Referrer Bonus (%)</Label>
              <Input
                type="number"
                defaultValue={gameSettings?.referrerBonus || 10}
                min="1"
                max="50"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Referee Bonus (USD)</Label>
              <Input
                type="number"
                defaultValue={gameSettings?.refereeBonus || 20}
                min="1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-300 mb-2">Min Deposit for Bonus (USD)</Label>
              <Input
                type="number"
                defaultValue={gameSettings?.minDepositForBonus || 50}
                min="1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="referral-active"
                defaultChecked={gameSettings?.referralActive || true}
              />
              <Label htmlFor="referral-active" className="text-sm text-gray-300">
                Referral Program Active
              </Label>
            </div>
            <Button type="submit" className="w-full rounded-2xl bg-gold hover:bg-emerald text-black font-bold px-6 py-3 shadow-md transition-all duration-300">
              Update Bonuses
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return renderUsers();
      case "finance":
        return renderFinance();
      case "game-control":
        return renderGameControl();
      default:
        return renderUsers();
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
