
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRaffles } from '@/contexts/RaffleContext';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Calendar, Award, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const History = () => {
  const navigate = useNavigate();
  const { raffles } = useRaffles();
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtrar apenas as rifas encerradas
  const completedRaffles = raffles.filter(raffle => raffle.status === 'completed');
  
  return (
    <PageTransition>
      <div className="container mx-auto max-w-md px-4 pb-24 pt-6 sm:max-w-lg sm:pb-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Histórico</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Veja os resultados dos sorteios anteriores
          </p>
        </header>
        
        {isLoading ? (
          <div className="flex flex-col items-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-primary dark:border-neutral-700 dark:border-t-primary" />
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Carregando histórico...</p>
          </div>
        ) : completedRaffles.length > 0 ? (
          <div className="space-y-4">
            {completedRaffles.map((raffle) => (
              <Card key={raffle.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="flex cursor-pointer items-center p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    onClick={() => navigate(`/raffle/${raffle.id}`)}
                  >
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="line-clamp-1 text-base font-medium">{raffle.title}</h3>
                      <div className="mt-1 flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-400">
                          <Award className="h-4 w-4" />
                          <span className="line-clamp-1">{raffle.prize}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {raffle.drawDate ? format(new Date(raffle.drawDate), "d 'de' MMMM", { locale: ptBR }) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="rounded-full bg-success-500 px-2 py-0.5 text-sm font-medium text-white">
                          #{raffle.winningNumber}
                        </span>
                        <ArrowRight className="ml-1 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-neutral-100 p-4 dark:bg-neutral-800">
              <Trophy className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Nenhum sorteio realizado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Os sorteios realizados aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default History;
