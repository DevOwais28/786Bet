import { Link } from "wouter";
import { BarChart3, Wallet, Clock, Users } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function DashboardSidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { id: "overview", icon: BarChart3, label: "Overview" },
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "history", icon: Clock, label: "Game History" },
    { id: "referral", icon: Users, label: "Referrals" },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-xl border-r border-white/10 p-8">
      <Link href="/">
        <div className="flex items-center space-x-3 mb-12 cursor-pointer group">
              <span className="text-3xl font-black text-gold tracking-tight group-hover:text-yellow-400 transition-all duration-300">786Bet</span>
              <span className="text-white/80 font-light tracking-wide">.casino</span>
        </div>
      </Link>
      
      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-[1.02] ${
                activeSection === item.id ? "bg-gradient-to-r from-gold/20 to-yellow-500/10 text-gold shadow-gold/20 shadow-lg scale-[1.02]" : ""
              }`}
            >
              <Icon className="w-6 h-6" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
