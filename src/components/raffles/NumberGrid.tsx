
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { NumberInfo } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NumberGridProps {
  numbers: number[];
  selectedNumbers: number[];
  numberInfo?: Record<number, NumberInfo>;
  onSelectNumber?: (number: number) => void;
  isCompleted?: boolean;
  winningNumber?: number;
  maxSelections?: number;
  showReservationInfo?: boolean;
}

const NumberGrid: React.FC<NumberGridProps> = ({ 
  numbers, 
  selectedNumbers, 
  numberInfo = {},
  onSelectNumber,
  isCompleted = false,
  winningNumber,
  maxSelections = 30,
  showReservationInfo = false
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  
  const handleNumberClick = (number: number) => {
    if (isCompleted) return;
    
    if (!onSelectNumber) return;
    
    const info = numberInfo[number];
    if (info && (info.status === 'reserved' || info.status === 'sold')) {
      toast({
        title: `Número ${info.status === 'reserved' ? 'reservado' : 'vendido'}`,
        description: `Este número já foi ${info.status === 'reserved' ? 'reservado' : 'vendido'} por ${info.userName}.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedNumbers.includes(number)) {
      if (selectedNumbers.length >= maxSelections) {
        toast({
          title: "Limite atingido",
          description: `Você só pode selecionar até ${maxSelections} números.`,
          variant: "destructive",
        });
        return;
      }
      
      setIsSelecting(true);
      setTimeout(() => {
        onSelectNumber(number);
        setIsSelecting(false);
      }, 150);
    } else {
      onSelectNumber(number);
    }
  };
  
  const getNumberStatus = (number: number) => {
    const info = numberInfo[number];
    if (!info) {
      return selectedNumbers.includes(number) ? 'selected' : 'available';
    }
    return info.status;
  };
  
  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {numbers.map((number) => {
        const status = getNumberStatus(number);
        const isSelected = status === 'selected' || status === 'reserved' || status === 'sold';
        const isWinner = winningNumber === number;
        const info = numberInfo[number];
        
        const numberButton = (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            disabled={isCompleted || isSelecting || status === 'reserved' || status === 'sold'}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-md text-lg font-medium transition-all duration-200",
              status === 'selected' && !isWinner && !isCompleted && "bg-primary text-primary-foreground dark:bg-primary-400",
              status === 'reserved' && !isWinner && !isCompleted && "bg-amber-500 text-white",
              status === 'sold' && !isWinner && !isCompleted && "bg-green-600 text-white",
              status === 'available' && !isCompleted && "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
              isCompleted && !isWinner && "bg-neutral-100 text-neutral-400 opacity-70 dark:bg-neutral-800 dark:text-neutral-500",
              isWinner && "bg-success-500 text-white animate-pulse"
            )}
          >
            {number}
            {status === 'reserved' && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                R
              </span>
            )}
            {status === 'sold' && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                V
              </span>
            )}
            {isWinner && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success-500 text-xs text-white">
                ✓
              </span>
            )}
          </button>
        );
        
        if (showReservationInfo && info && (info.status === 'reserved' || info.status === 'sold')) {
          return (
            <TooltipProvider key={number}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  {numberButton}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{info.userName}</p>
                    <p className="text-xs text-neutral-500">{info.userEmail}</p>
                    <p className="text-xs">
                      {info.status === 'reserved' 
                        ? `Reservado em: ${info.reservedAt?.toLocaleString()}`
                        : `Comprado em: ${info.purchasedAt?.toLocaleString()}`
                      }
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        
        return numberButton;
      })}
    </div>
  );
};

export default NumberGrid;
