import { useState, useEffect } from "react";
import MultiplierDisplay from "@/components/game/multiplier-display";
import BetPanel from "@/components/game/bet-panel";
import Chat from "@/components/game/chat";

export default function GameRoom() {
  const [multiplier, setMultiplier] = useState(1.0);
  type GameState = "waiting" | "flying" | "crashed";

const [gameState, setGameState] = useState<GameState>("waiting");

  const [countdown, setCountdown] = useState(5);
  const [recentResults] = useState([2.45, 1.02, 5.67, 3.21, 1.15]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState === "flying") {
        setMultiplier((prev: number) => prev + 0.01);

        if (Math.random() < (multiplier - 1) * 0.001) {
          setGameState("crashed");
          setTimeout(() => {
            setGameState("waiting");
            setCountdown(5);
            setMultiplier(1.0);
          }, 3000);
        }
      } else if (gameState === "waiting") {
        setCountdown((prev: number) => {
          if (prev <= 1) {
            setGameState("flying");
            return 5;
          }
          return prev - 1;
        });
      }
    }, gameState === "flying" ? 100 : 1000);

    return () => clearInterval(interval);
  }, [gameState, multiplier]);

  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setShowChat(!mobile);
    };

    checkIfMobile();
    const handleResize = () => setTimeout(checkIfMobile, 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const chatContainer = document.querySelector(".chat-container");
      const chatButton = document.querySelector(".chat-toggle-button");
      if (
        showChat &&
        chatContainer &&
        !chatContainer.contains(target) &&
        !chatButton?.contains(target)
      ) {
        setShowChat(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, showChat]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden pt-16 sm:pt-18 lg:pt-20">
      {/* Sidebar Chat */}
      <div
        className={`fixed lg:static h-full lg:h-auto top-16 sm:top-18 lg:top-20 w-full lg:w-80 bg-gradient-to-b from-gray-900 to-gray-800/80 border-l lg:border-r border-gold/20 z-40 transition-transform duration-300 chat-container ${
          isMobile ? (showChat ? "translate-x-0" : "translate-x-full") : ""
        }`}
        style={{
          maxHeight: "calc(100vh - 4rem)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-amber-500 to-gold animate-pulse"></div>
        <div className="h-full pt-2">
          <Chat />
        </div>
      </div>

      {/* Game Main Section */}
      <div className="flex-1 flex flex-col relative overflow-hidden min-h-screen">
        {isMobile && (
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="chat-toggle-button fixed bottom-6 right-4 z-50 bg-gradient-to-br from-gold to-amber-400 text-black rounded-full p-4 shadow-lg hover:scale-105 transition-all"
            aria-label={showChat ? "Close Chat" : "Open Chat"}
          >
            {showChat ? "✕" : "💬"}
          </button>
        )}

        {/* Game Info */}
        <div className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col items-center justify-start space-y-4 sm:space-y-6">
          <div className="text-center pt-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gold mb-2">Aviator</h2>
            <p className="text-xs sm:text-sm text-gray-400">Cash out before the plane flies away!</p>
          </div>
          

          <div className="w-full max-w-4xl">
            <MultiplierDisplay multiplier={multiplier} gameState={gameState} />
          </div>

          <div className="w-full max-w-4xl bg-gray-800/80 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="h-48 sm:h-64 lg:h-80 bg-gray-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&h=400"
                alt="Aircraft flying through clouds"
                className="w-full h-full object-cover rounded-lg opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-xs sm:text-sm">Live Game Chart</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl">
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-xs text-gray-400">Recent:</span>
              {recentResults.map((result, index) => (
                <span
                  key={index}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    result >= 2 ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {result.toFixed(2)}x
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Game Stats Bar */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-3 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {gameState === "flying" ? "Flying" : gameState === "crashed" ? "Crashed" : "Next Round In"}
                </p>
                <p className="text-gold font-bold text-lg sm:text-xl">
                  {gameState === "waiting" ? `${countdown}s` : gameState === "flying" ? "🚀" : "💥"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Players</p>
                <p className="font-bold text-lg sm:text-xl">247</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Bet</p>
                <p className="text-emerald-500 font-bold text-lg sm:text-xl">$12,456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bet Panel */}
        <div className="bg-gradient-to-t from-gray-900 to-gray-900/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 border-t border-gray-800">
          <div className="max-w-md mx-auto w-full">
            <BetPanel 
              gameState={gameState}
              onBetPlaced={(amount: number) => {
                console.log('Bet placed:', amount);
              }}
              onCashOut={() => {
                console.log('Cashing out');
              }}
              balance={1000}
              currentMultiplier={multiplier}
              isBetting={gameState === 'flying'}
              hasCashedOut={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
