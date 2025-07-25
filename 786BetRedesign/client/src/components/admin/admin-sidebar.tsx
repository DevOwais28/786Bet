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
    <div className="h-full bg-gray-900 p-4 lg:p-6">
      <Link href="/">
        <div className="flex items-center space-x-2 mb-6 lg:mb-8 cursor-pointer">
          <span className="text-xl lg:text-2xl font-bold text-gold">786Bet</span>
          <span className="text-white text-xs lg:text-sm">Admin</span>
        </div>
      </Link>
      
      <nav className="space-y-1 lg:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-gray-300 hover:text-white transition-all duration-300 ${
                activeSection === item.id ? "bg-gold/20 text-gold" : ""
              }`}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="text-sm lg:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
