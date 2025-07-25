import { Link } from "wouter";
import { Users, CreditCard, Gamepad2, Settings } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const adminMenuItems = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'withdrawals', label: 'Withdrawals', icon: CreditCard },
  { id: 'game-control', label: 'Game Control', icon: Settings },
];

export default function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  return (
    <div className="h-full bg-gray-900 text-white p-4 sm:p-6 flex flex-col">
      <div className="mb-8 sm:mb-12">
        <Link href="/">
          <span className="text-2xl sm:text-3xl font-bold text-red-500 cursor-pointer">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {adminMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium ${ 
              activeSection === item.id
                ? 'bg-red-500/10 text-red-500 shadow-inner shadow-red-500/10'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <Link href="/dashboard">
          <button className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
