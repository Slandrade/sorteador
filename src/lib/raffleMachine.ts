
import { Raffle } from './types';
import { toast } from '@/hooks/use-toast';

// Gera um array com 30 números (1-30)
export const generateNumbers = (): number[] => {
  return Array.from({ length: 100 }, (_, i) => i + 1);
};

// Seleciona um número aleatório entre os disponíveis
export const drawWinner = (raffle: Raffle): number | undefined => {
  const availableNumbers = raffle.numbers.filter(num => 
    raffle.selectedNumbers.includes(num)
  );
  
  if (availableNumbers.length === 0) {
    toast({
      title: "Não há números selecionados",
      description: "É necessário ter pelo menos um número selecionado para realizar o sorteio.",
      variant: "destructive",
    });
    return undefined;
  }
  
  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  return availableNumbers[randomIndex];
};

// Gera um ID único
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Compartilha o resultado do sorteio
export const shareResult = async (raffle: Raffle) => {
  if (!raffle.winningNumber) {
    toast({
      title: "Erro ao compartilhar",
      description: "Este sorteio ainda não tem um número vencedor.",
      variant: "destructive",
    });
    return;
  }
  
  const text = `🎉 O número vencedor da rifa "${raffle.title}" foi: ${raffle.winningNumber}! O prêmio é: ${raffle.prize}`;
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: `Resultado da Rifa: ${raffle.title}`,
        text,
      });
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado para a área de transferência",
        description: "O resultado foi copiado para a área de transferência.",
      });
    }
  } catch (error) {
    toast({
      title: "Erro ao compartilhar",
      description: "Não foi possível compartilhar o resultado.",
      variant: "destructive",
    });
  }
};
