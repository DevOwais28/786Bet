interface MultiplierDisplayProps {
  multiplier: number;
  gameState: "waiting" | "flying" | "crashed";
}

export default function MultiplierDisplay({ multiplier, gameState }: MultiplierDisplayProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 text-center">
      <div className={gameState === "flying" ? "multiplier-animation" : ""}>
        <div className={`text-6xl font-bold mb-2 ${
          gameState === "flying" ? "text-gold" : 
          gameState === "crashed" ? "text-red-500" : 
          "text-gray-400"
        }`}>
          {gameState === "waiting" ? "1.00x" : `${multiplier.toFixed(2)}x`}
        </div>
        <div className="text-gray-400">
          {gameState === "waiting" ? "Get Ready..." : 
           gameState === "flying" ? "Current Multiplier" : 
           "Crashed!"}
        </div>
      </div>
    </div>
  );
}
