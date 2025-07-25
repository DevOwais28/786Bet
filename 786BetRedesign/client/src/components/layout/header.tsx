import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-black border-b border-gold">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold text-gold tracking-wide">
          786Bet
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 items-center text-gold text-base font-medium">
            <Link href="/game-room" className="hover:text-yellow-400 transition-colors">Play</Link>
            <Link href="/deposit" className="hover:text-yellow-400 transition-colors">Deposit</Link>
            <Link href="/withdraw" className="hover:text-yellow-400 transition-colors">Withdraw</Link>
            <Link href="/dashboard" className="hover:text-yellow-400 transition-colors">Dashboard</Link>
            <Link href="/admin" className="hover:text-yellow-400 transition-colors">Admin</Link>
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-gold border border-gold rounded-lg hover:bg-gold hover:text-black transition-all duration-300">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 bg-gradient-to-r from-gold to-yellow-400 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gold focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gold px-4 pb-4">
          <nav className="flex flex-col gap-4 text-gold text-base font-semibold">
            <Link href="/game-room" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Play</Link>
            <Link href="/deposit" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Deposit</Link>
            <Link href="/withdraw" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Withdraw</Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Dashboard</Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition-colors">Admin</Link>
          </nav>
          
          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gold/30">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full px-4 py-3 text-gold border border-gold rounded-lg hover:bg-gold hover:text-black transition-all duration-300">
                Login
              </button>
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}>
              <button className="w-full px-4 py-3 bg-gradient-to-r from-gold to-yellow-400 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
