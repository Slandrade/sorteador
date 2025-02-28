import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Award, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shareResult } from '@/lib/raffleMachine';
import { Raffle } from '@/lib/types';

interface DrawProcessProps {
  raffle: Raffle;
  onDrawComplete: (winningNumber: number) => void;
}

const DrawProcess: React.FC<DrawProcessProps> = ({ raffle, onDrawComplete }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [drawComplete, setDrawComplete] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | undefined>(raffle.winningNumber);
  const [remainingNumbers, setRemainingNumbers] = useState<number[]>([]);

  useEffect(() => {
    // Inicialmente, definir remainingNumbers como a lista completa de números
    setRemainingNumbers(raffle.numbers);
  }, [raffle]);

  const handleStartDraw = () => {
    if (isDrawing) return;

    // Filtrar apenas os números reservados
    const reservedNumbers = raffle.numbers.filter(number => {
      const info = raffle.numberInfo[number];
      return info && info.status === 'reserved';
    });

    const selectedNumbers = reservedNumbers.length > 0 ? reservedNumbers : raffle.numbers;

    if (selectedNumbers.length === 0) return;

    setIsDrawing(true);

    // Animação de sorteio
    let counter = 0;
    const animationDuration = 2000; // 2 segundos
    const interval = 100; // 100ms entre cada número
    const iterations = animationDuration / interval;

    const drawInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
      setCurrentNumber(selectedNumbers[randomIndex]);

      counter++;
      if (counter >= iterations) {
        clearInterval(drawInterval);

        // Seleciona o número vencedor
        const winnerIndex = Math.floor(Math.random() * selectedNumbers.length);
        const winner = selectedNumbers[winnerIndex];

        setWinningNumber(winner);
        setCurrentNumber(winner);
        setDrawComplete(true);
        setIsDrawing(false);

        // Remove o número vencedor da lista de números restantes
        setRemainingNumbers(prev => prev.filter(num => num !== winner));

        onDrawComplete(winner);
      }
    }, interval);
  };

  const handleShare = () => {
    if (winningNumber) {
      const raffleWithWinner = {
        ...raffle,
        winningNumber,
      };
      shareResult(raffleWithWinner);
    }
  };

  const handleDrawAgain = () => {
    setDrawComplete(false);
    setCurrentNumber(null);
    setWinningNumber(undefined);
    handleStartDraw();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {!drawComplete ? (
        <>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
            {isDrawing && (
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
            )}
            <span className="text-3xl font-bold text-neutral-700">
              {currentNumber || '?'}
            </span>
          </div>

          <Button
            size="lg"
            disabled={isDrawing || remainingNumbers.length === 0}
            onClick={handleStartDraw}
            className={cn(
              "relative overflow-hidden px-8",
              isDrawing && "animate-pulse"
            )}
          >
            <Award className="mr-2 h-5 w-5" />
            {isDrawing ? 'Sorteando...' : 'Iniciar Sorteio'}
          </Button>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="mb-4 flex flex-col items-center">
              <div className="text-sm text-neutral-500">Número sorteado</div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success-500 text-white shadow-lg">
                <span className="text-4xl font-bold">{winningNumber}</span>
              </div>
            </div>
            <p className="text-center text-neutral-600">
              O número {winningNumber} foi o vencedor da rifa!
            </p>
          </div>

          <Button variant="outline" size="lg" onClick={handleShare} className="w-full md:w-auto">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar Resultado
          </Button>

          <Button variant="outline" size="lg" onClick={handleDrawAgain} className="w-full md:w-auto mt-4">
            Sortear Novamente
          </Button>
        </>
      )}
    </div>
  );
};

export default DrawProcess;