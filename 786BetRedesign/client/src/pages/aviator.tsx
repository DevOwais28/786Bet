import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { TrendingUp, Play } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface GameRound {
  id: string;
  multiplier: number;
  crashPoint: number;
  startTime: number;
  status: 'waiting' | 'starting' | 'running' | 'crashed';
  players: Player[];
}

interface Player {
  id: string;
  username: string;
  betAmount: number;
  cashoutMultiplier: number | null;
  profit: number;
  status: 'betting' | 'playing' | 'cashed_out' | 'lost';
}

interface Bet {
  id: string;
  amount: number;
  multiplier: number;
  status: 'pending' | 'won' | 'lost';
  profit: number;
  roundId: string;
  timestamp: string;
}

export default function AviatorGame() {
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'starting' | 'running' | 'crashed'>('waiting');
  const [betAmount, setBetAmount] = useState('');
  const [autoCashout, setAutoCashout] = useState('2.0');
  const [isBetting, setIsBetting] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashoutMultiplier, setCashoutMultiplier] = useState<number | null>(null);
  const [betId, setBetId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const { data: userProfile } = useQuery<{ balance: number }>({ queryKey: ['/api/user/profile'] });
  const { data: gameHistory = [] } = useQuery<any[]>({ queryKey: ['/api/game/history'], refetchInterval: 5000 });
  const { data: currentGame } = useQuery<GameRound>({ queryKey: ['/api/game/current'], refetchInterval: 1000 });

  const placeBetMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/game/bet', {
        amount,
        autoCashout: parseFloat(autoCashout),
      });
      return response.json();
    },
    onSuccess: (data: { betId: string }) => {
      setBetId(data.betId);
      setIsBetting(true);
      setHasCashedOut(false);
      toast({ title: 'Bet placed!', description: `Bet $${betAmount} placed successfully` });
    },
    onError: (error: Error) => {
      toast({
        title: 'Bet failed',
        description: error.message || 'Failed to place bet',
        variant: 'destructive',
      });
    },
  });

  const cashoutMutation = useMutation({
    mutationFn: async () => {
      if (!betId) throw new Error('No active bet');
      const response = await apiRequest('POST', '/api/game/cashout', {
        betId,
        multiplier: currentMultiplier,
      });
      return response.json();
    },
    onSuccess: (data: { multiplier: number; profit: number }) => {
      setHasCashedOut(true);
      setCashoutMultiplier(data.multiplier);
      setIsBetting(false);
      toast({
        title: 'Cashed out!',
        description: `You won $${data.profit.toFixed(2)}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Cashout failed',
        description: error.message || 'Failed to cash out',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!currentGame) return;
    setGameStatus(currentGame.status);
    setCurrentMultiplier(currentGame.multiplier || 1.0);

    if (gameLoopRef.current) clearInterval(gameLoopRef.current);

    if (currentGame.status === 'running') {
      gameLoopRef.current = setInterval(() => {
        setCurrentMultiplier((prev) => {
          const newMult = prev * 1.01;
          if (newMult >= currentGame.crashPoint) {
            setGameStatus('crashed');
            clearInterval(gameLoopRef.current!);
            return currentGame.crashPoint;
          }
          return newMult;
        });
      }, 100);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [currentGame]);

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid bet amount', variant: 'destructive' });
      return;
    }
    if (amount > (userProfile?.balance || 0)) {
      toast({ title: 'Insufficient balance', description: 'Please deposit funds', variant: 'destructive' });
      return;
    }
    placeBetMutation.mutate(amount);
  };

  const handleCashout = () => {
    if (!isBetting || hasCashedOut) return;
    cashoutMutation.mutate();
  };

  const formatMultiplier = (multiplier: number) => multiplier.toFixed(2) + 'x';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-white/10">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
              Aviator
            </CardTitle>
            <div className="text-sm text-gray-400">
              Balance:{' '}
              <span className="text-gold font-bold">
                ${userProfile?.balance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="text-5xl font-black text-gold">
                {formatMultiplier(currentMultiplier)}
              </div>
              <div className="text-sm text-gray-400">Current Multiplier</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Bet Amount"
                className="bg-gray-700 text-white rounded-xl"
                disabled={isBetting}
              />
              <Input
                type="number"
                value={autoCashout}
                onChange={(e) => setAutoCashout(e.target.value)}
                placeholder="Auto Cashout"
                className="bg-gray-700 text-white rounded-xl"
                disabled={isBetting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handlePlaceBet}
                disabled={isBetting || !betAmount || gameStatus !== 'waiting'}
                className="rounded-xl bg-emerald hover:bg-green-500 text-black font-bold"
              >
                <Play className="mr-2" /> Place Bet
              </Button>
              <Button
                onClick={handleCashout}
                disabled={!isBetting || hasCashedOut || gameStatus !== 'running'}
                className="rounded-xl bg-gold hover:bg-yellow-500 text-black font-bold"
              >
                <TrendingUp className="mr-2" /> Cash Out
              </Button>
            </div>

            {isBetting && (
              <div className="p-4 bg-gray-700 rounded-xl mt-4">
                <div className="text-sm font-medium">Active Bet: ${betAmount}</div>
                {cashoutMultiplier && (
                  <div className="text-sm text-gold font-bold mt-2">
                    Cashed at: {formatMultiplier(cashoutMultiplier)}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-10">
          <div className="w-28 h-28">
            <DotLottieReact
              src="https://lottie.host/1a620877-cb99-4b21-a064-5ea740fdde72/BaDc7bTvKs.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </div>
  );
}
