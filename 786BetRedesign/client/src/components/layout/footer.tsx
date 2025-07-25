import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="py-20 bg-gradient-to-t from-black via-gray-900/50 to-transparent border-t border-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <span className="text-3xl font-black text-gold tracking-tight group-hover:text-yellow-400 transition-all duration-300">786Bet</span>
              <span className="text-white/80 font-light tracking-wide">.casino</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              The ultimate destination for crash games and instant payouts.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/">
                <span className="block text-gray-300 hover:text-gold transition-all duration-300 cursor-pointer hover:translate-x-1">Home</span>
              </Link>
              <Link href="/game-room">
                <span className="block text-gray-400 hover:text-gold transition-colors duration-300 cursor-pointer">Games</span>
              </Link>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Promotions</a>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">VIP</a>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Help Center</a>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Live Chat</a>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Contact Us</a>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Terms of Service</a>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Security</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Provably Fair</a>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Responsible Gaming</a>
              <a href="#" className="block text-gray-400 hover:text-gold transition-colors duration-300">Security</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-16 pt-8 text-center">
          <p className="text-gray-400 text-sm tracking-wide">&copy; 2024 786Bet.casino. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
