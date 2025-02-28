
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Raffle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Award, Calendar } from 'lucide-react';

interface RaffleCardProps {
  raffle: Raffle;
}

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle }) => {
  const totalSelected = raffle.selectedNumbers.length;
  const totalNumbers = raffle.numbers.length;
  const progress = (totalSelected / totalNumbers) * 100;
  
  return (
    <Link to={`/raffle/${raffle.id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant={raffle.status === 'active' ? 'outline' : 'secondary'}>
              {raffle.status === 'active' ? 'Ativa' : 'Encerrada'}
            </Badge>
            <span className="text-xs text-neutral-500">
              {formatDistanceToNow(new Date(raffle.createdAt), { 
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
          
          <h3 className="mb-1 line-clamp-1 text-lg font-medium">{raffle.title}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-neutral-600">{raffle.description}</p>
          
          <div className="flex items-center space-x-1 text-sm text-primary-500">
            <Award size={16} />
            <span className="font-medium">{raffle.prize}</span>
          </div>
          
          {raffle.drawDate && (
            <div className="mt-2 flex items-center space-x-1 text-xs text-neutral-500">
              <Calendar size={14} />
              <span>Sorteio: {raffle.drawDate.toLocaleDateString()}</span>
            </div>
          )}
          
          {raffle.winningNumber && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs text-neutral-500">Número vencedor:</span>
              <span className="rounded-full bg-success-500 px-2 py-0.5 text-xs font-medium text-white">
                {raffle.winningNumber}
              </span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t bg-neutral-50 px-4 py-2">
          <div className="w-full">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>{totalSelected} de {totalNumbers} números</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RaffleCard;
