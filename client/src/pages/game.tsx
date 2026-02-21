import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Trophy } from "lucide-react";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "loss" | "tie" | null;

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

// Icons as SVG components
const RockIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#4B5563" stroke="none"/>
    <path d="M16 12a4 4 0 0 0-8 0" stroke="#1F2937" strokeWidth="2"/>
    <path d="M8 12v3a4 4 0 0 0 8 0v-3" stroke="#1F2937" strokeWidth="2"/>
  </svg>
);

const PaperIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#4B5563" stroke="none"/>
    <polyline points="14 2 14 8 20 8" stroke="#1F2937" strokeWidth="2"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="#1F2937" strokeWidth="2"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="#1F2937" strokeWidth="2"/>
    <polyline points="10 9 9 9 8 9" stroke="#1F2937" strokeWidth="2"/>
  </svg>
);

const ScissorsIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" fill="#4B5563" stroke="none"/>
    <circle cx="6" cy="18" r="3" fill="#4B5563" stroke="none"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

const ChoiceCircle = ({ choice, isWinner, onClick, size = "normal" }: { choice: Choice, isWinner?: boolean, onClick?: () => void, size?: "normal" | "large" }) => {
  const Icon = choice === "rock" ? RockIcon : choice === "paper" ? PaperIcon : ScissorsIcon;
  const sizeClasses = size === "large" ? "w-[200px] h-[200px] border-[24px]" : "w-[140px] h-[140px] border-[16px]";
  
  return (
    <div className="relative flex justify-center items-center">
      {isWinner && (
        <div className="absolute inset-0 z-0">
          <div className="winner-ring"></div>
          <div className="winner-ring"></div>
          <div className="winner-ring"></div>
        </div>
      )}
      <div 
        className={`choice-circle ${sizeClasses} choice-${choice} ${onClick ? "cursor-pointer" : "cursor-default"} z-10`}
        onClick={onClick}
        data-testid={`choice-${choice}`}
      >
        <Icon />
      </div>
    </div>
  );
};

export default function Game() {
  const [userScore, setUserScore] = useState(0);
  const [pcScore, setPcScore] = useState(0);
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [pcChoice, setPcChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const savedUserScore = localStorage.getItem("userScore");
    const savedPcScore = localStorage.getItem("pcScore");
    if (savedUserScore) setUserScore(parseInt(savedUserScore, 10));
    if (savedPcScore) setPcScore(parseInt(savedPcScore, 10));
  }, []);

  const saveScores = (user: number, pc: number) => {
    localStorage.setItem("userScore", user.toString());
    localStorage.setItem("pcScore", pc.toString());
  };

  const getResult = (user: Choice, pc: Choice): Result => {
    if (user === pc) return "tie";
    if (
      (user === "rock" && pc === "scissors") ||
      (user === "paper" && pc === "rock") ||
      (user === "scissors" && pc === "paper")
    ) {
      return "win";
    }
    return "loss";
  };

  const handleChoice = (choice: Choice) => {
    const randomPcChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const res = getResult(choice, randomPcChoice);
    
    setUserChoice(choice);
    setPcChoice(randomPcChoice);
    setResult(res);

    if (res === "win") {
      setUserScore(s => {
        const newScore = s + 1;
        saveScores(newScore, pcScore);
        return newScore;
      });
    } else if (res === "loss") {
      setPcScore(s => {
        const newScore = s + 1;
        saveScores(userScore, newScore);
        return newScore;
      });
    }
  };

  const resetGame = () => {
    setUserChoice(null);
    setPcChoice(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 font-sans relative overflow-hidden">
      {/* Header / Score Board */}
      <div className="w-full max-w-2xl border-[3px] border-[rgba(255,255,255,0.3)] rounded-2xl p-4 flex justify-between items-center mb-16 z-20 bg-black/10 backdrop-blur-sm">
        <div className="flex flex-col text-white text-[32px] md:text-[40px] font-bold leading-tight tracking-wider uppercase">
          <span>Rock</span>
          <span>Paper</span>
          <span>Scissors</span>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white rounded-xl py-3 px-6 flex flex-col items-center min-w-[110px] md:min-w-[130px] shadow-lg">
            <span className="text-[#656565] text-xs md:text-sm font-bold tracking-widest uppercase">Computer</span>
            <span className="text-[#252525] text-4xl md:text-6xl font-bold mt-1" data-testid="text-pc-score">{pcScore}</span>
          </div>
          <div className="bg-white rounded-xl py-3 px-6 flex flex-col items-center min-w-[110px] md:min-w-[130px] shadow-lg">
            <span className="text-[#656565] text-xs md:text-sm font-bold tracking-widest uppercase">Your Score</span>
            <span className="text-[#252525] text-4xl md:text-6xl font-bold mt-1" data-testid="text-user-score">{userScore}</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      {!userChoice ? (
        <div className="relative w-full max-w-[400px] h-[400px] mt-12">
          {/* Triangle Background Lines */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] -z-10" viewBox="0 0 100 100">
            <polygon points="50,10 10,90 90,90" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="15" strokeLinejoin="round" />
          </svg>
          
          <div className="absolute top-0 left-0 -translate-x-4 hover:-translate-y-2 transition-transform">
            <ChoiceCircle choice="rock" onClick={() => handleChoice("rock")} />
          </div>
          <div className="absolute top-0 right-0 translate-x-4 hover:-translate-y-2 transition-transform">
            <ChoiceCircle choice="paper" onClick={() => handleChoice("paper")} />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 hover:translate-y-2 transition-transform">
            <ChoiceCircle choice="scissors" onClick={() => handleChoice("scissors")} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl mt-12">
          <div className="flex flex-col items-center gap-8 z-10 order-2 md:order-1">
            <h3 className="text-2xl font-bold tracking-widest uppercase">You Picked</h3>
            <ChoiceCircle choice={userChoice} size="large" isWinner={result === "win"} />
          </div>

          <div className="flex flex-col items-center gap-6 z-20 order-1 md:order-2 my-8 md:my-0">
            <h2 className="text-[52px] md:text-[64px] font-bold text-center leading-none whitespace-nowrap drop-shadow-md">
              {result === "win" && "YOU WIN"}
              {result === "loss" && "YOU LOST"}
              {result === "tie" && "TIE UP"}
              {result !== "tie" && <div className="text-[32px] md:text-[40px] mt-2">AGAINST PC</div>}
            </h2>
            <button 
              onClick={resetGame}
              className="bg-white text-[#252525] uppercase tracking-widest font-bold py-3 px-12 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all text-lg shadow-lg"
              data-testid="button-play-again"
            >
              {result === "tie" ? "Replay" : "Play Again"}
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 z-10 order-3">
            <h3 className="text-2xl font-bold tracking-widest uppercase">PC Picked</h3>
            <ChoiceCircle choice={pcChoice!} size="large" isWinner={result === "loss"} />
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        <button 
          onClick={() => setShowRules(true)}
          className="border-[3px] border-white text-white uppercase tracking-widest font-semibold py-2 px-8 rounded-xl hover:bg-white hover:text-black transition-colors"
          data-testid="button-rules"
        >
          Rules
        </button>
        {result === "win" && (
          <Link href="/hurray">
            <button 
              className="border-[3px] border-white bg-white text-black uppercase tracking-widest font-bold py-2 px-8 rounded-xl hover:bg-gray-100 transition-colors"
              data-testid="button-next"
            >
              Next
            </button>
          </Link>
        )}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#004429] text-white border-4 border-white p-8 rounded-[30px] max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setShowRules(false)}
              className="absolute -right-6 -top-6 bg-red-600 text-white rounded-full p-3 border-4 border-white hover:bg-red-700 hover:scale-110 transition-all shadow-xl"
            >
              <X size={32} strokeWidth={3} />
            </button>
            <h2 className="text-center text-4xl font-bold mb-8 uppercase tracking-wider">Game Rules</h2>
            <ul className="space-y-6 list-none pl-0 font-medium text-lg">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-4 text-2xl">■</span>
                <span>Rock beats Scissors, Scissors beat Paper, and Paper beats Rock.</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-4 text-2xl">■</span>
                <span>Agree ahead of time whether you'll count off "rock, paper, scissors, shoot" or just "rock, paper, scissors."</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-4 text-2xl">■</span>
                <span>Use rock, paper, scissors to settle minor decisions or simply play to pass the time</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-4 text-2xl">■</span>
                <span>If both players lay down the same hand, each player lays down another hand</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
