import { Link } from "wouter";
import { Users, DollarSign, Settings } from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const menuItems = [
    { id: "users", icon: Users, label: "Users" },
    { id: "finance", icon: DollarSign, label: "Finance" },
    { id: "game-control", icon: Settings, label: "Game Control" },
  ];

  return (
    <div className="w-64 bg-gray-900 p-6">
      <Link href="/">
        <div className="flex items-center space-x-2 mb-8 cursor-pointer">
          <span className="text-2xl font-bold text-gold">786Bet</span>
          <span className="text-white text-sm">Admin</span>
        </div>
      </Link>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 ${
                activeSection === item.id ? "bg-gold/20 text-gold" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
