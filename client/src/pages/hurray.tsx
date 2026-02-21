import { Link } from "wouter";
import { Trophy } from "lucide-react";

export default function Hurray() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 font-sans relative overflow-hidden text-center">
      
      {/* Stars decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-yellow-300 w-3 h-3 rounded-sm rotate-45 animate-pulse"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div 
            key={`s-${i}`}
            className="absolute bg-white w-2 h-2 rounded-full opacity-60 animate-pulse"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
          <Trophy size={140} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
        </div>
        
        <h1 className="text-[80px] font-bold tracking-widest leading-tight mb-2">HURRAY!!</h1>
        <h2 className="text-[40px] font-bold tracking-widest mb-12">YOU WON THE GAME</h2>
        
        <Link href="/">
          <button 
            className="bg-white text-[#252525] uppercase tracking-widest font-bold py-3 px-12 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            data-testid="button-play-again-hurray"
          >
            Play Again
          </button>
        </Link>
      </div>

      {/* Rules button */}
      <div className="absolute bottom-8 right-8">
        <button 
          className="border-2 border-white text-white uppercase tracking-widest font-semibold py-2 px-8 rounded-lg hover:bg-white hover:text-black transition-colors"
          data-testid="button-rules-hurray"
        >
          Rules
        </button>
      </div>
    </div>
  );
}
