import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Shield, Users, Star, Building2, Coins, Trophy, Gamepad2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (link) {
        e.preventDefault();
        const id = link.getAttribute('href')?.substring(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            const headerOffset = 80; // Height of the header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="bg-black text-white font-inter overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-20 sm:pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                  Aviator
                </span>
                <br />
                <span className="text-white">Crash Game</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                Join 786Bet.casino for premium gaming experiences, instant payouts, and the most exciting crash games in the industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="#demo">
                  <Button className="w-full sm:w-auto rounded-xl sm:rounded-2xl bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-black font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 shadow-2xl hover:shadow-gold/25 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg">
                    Start Playing Now
                  </Button>
                </Link>
                <Link href="/game-room">
                  <Button variant="outline" className="w-full sm:w-auto rounded-xl sm:rounded-2xl border-2 border-white/20 bg-transparent hover:bg-white/10 text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg backdrop-blur-sm hover:backdrop-blur-md">
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Modern Casino Chip Visual - Always centered and responsive */}
            <div className={`flex justify-center items-center w-full py-10 sm:py-16 lg:py-24 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 flex items-center justify-center">
                {/* Glowing shadow */}
                <div className="absolute inset-0 rounded-full blur-2xl bg-gold/30 animate-pulse" style={{ filter: 'blur(32px)' }}></div>
                {/* Casino Chip SVG */}
                <svg
                  className="relative z-10 w-full h-full animate-float"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="chipGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Outer ring */}
                  <circle cx="100" cy="100" r="90" fill="#111" stroke="#FFD700" strokeWidth="10" />
                  {/* Inner ring */}
                  <circle cx="100" cy="100" r="70" fill="#222" stroke="#50C878" strokeWidth="6" />
                  {/* Chip stripes */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <rect
                      key={i}
                      x={100 - 10}
                      y={20}
                      width={20}
                      height={20}
                      rx={4}
                      fill="#FFD700"
                      transform={`rotate(${i * 45} 100 100)`}
                    />
                  ))}
                  {/* Center circle */}
                  <circle cx="100" cy="100" r="38" fill="#fff" stroke="#E11D48" strokeWidth="6" />
                  {/* Dollar icon */}
                  <text
                    x="100"
                    y="114"
                    textAnchor="middle"
                    fontSize="48"
                    fontWeight="bold"
                    fill="#E11D48"
                    fontFamily="monospace"
                  >
                    $
                  </text>
                  {/* Glow */}
                  <circle cx="100" cy="100" r="90" fill="url(#chipGlow)" />
                </svg>
                {/* Floating animation (Tailwind custom) */}
                <style>{`
                  .animate-float {
                    animation: floaty 3s ease-in-out infinite;
                  }
                  @keyframes floaty {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-18px); }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent animate-pulse">
              Why Choose 786Bet?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the most advanced Aviator betting platform with cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/20 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">Lightning Fast</h3>
              <p className="text-gray-400">Instant deposits and withdrawals with zero delays</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald/20 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald to-green-500 bg-clip-text text-transparent">100% Secure</h3>
              <p className="text-gray-400">Military-grade encryption and provably fair gaming</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-red/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red/20 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-red to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red to-pink-500 bg-clip-text text-transparent">High Multipliers</h3>
              <p className="text-gray-400">Win up to 1000x your bet with our dynamic multiplier system</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-2">
              Get started in minutes with our simple 3-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-gold/50">
                <span className="text-xl sm:text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">Sign Up</h3>
              <p className="text-sm sm:text-base text-gray-400 px-2">Create your account in seconds with just your email</p>
            </div>
            
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald/50">
                <span className="text-xl sm:text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-emerald to-green-500 bg-clip-text text-transparent">Deposit</h3>
              <p className="text-sm sm:text-base text-gray-400 px-2">Add funds using your preferred payment method</p>
            </div>
            
            <div className="text-center group transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red/50">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-red to-pink-500 bg-clip-text text-transparent">Play & Win</h3>
              <p className="text-sm sm:text-base text-gray-400 px-2">Place your bets and watch your profits soar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold">50K+</div>
              <div className="text-sm sm:text-base text-gray-300">Active Players</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald">$2.5M+</div>
              <div className="text-sm sm:text-base text-gray-300">Total Payouts</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red">99.9%</div>
              <div className="text-sm sm:text-base text-gray-300">Uptime</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold">24/7</div>
              <div className="text-sm sm:text-base text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-wide">What Players Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-gray-800/50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                "Amazing platform! The payouts are instant and the games are so thrilling. I've been playing for months and never had an issue."
              </p>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm sm:text-base">MK</span>
                </div>
                <div>
                  <div className="font-medium text-sm sm:text-base">Mike Khan</div>
                  <div className="text-xs sm:text-sm text-gray-400">Premium Player</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                "The transparency of the provably fair system gives me complete confidence. Great support team too!"
              </p>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm sm:text-base">SA</span>
                </div>
                <div>
                  <div className="font-medium text-sm sm:text-base">Sarah Ahmed</div>
                  <div className="text-xs sm:text-sm text-gray-400">Regular Player</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl">
              <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                "Best crash game experience I've ever had. The interface is clean and the multipliers are insane!"
              </p>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm sm:text-base">JD</span>
                </div>
                <div>
                  <div className="font-medium text-sm sm:text-base">John Doe</div>
                  <div className="text-xs sm:text-sm text-gray-400">VIP Player</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
