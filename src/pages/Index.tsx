
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRaffles } from '@/contexts/RaffleContext';
import { useTheme } from '@/contexts/ThemeContext';
import PageTransition from '@/components/layout/PageTransition';
import RaffleCard from '@/components/raffles/RaffleCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Plus, Ticket, Sun, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const navigate = useNavigate();
  const { raffles } = useRaffles();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useRaffles();
  const [isLoading, setIsLoading] = useState(false);
  
  const activeRaffles = raffles.filter(raffle => raffle.status === 'active');
  const completedRaffles = raffles.filter(raffle => raffle.status === 'completed');
  
  return (
    <PageTransition>
      <div className="container mx-auto max-w-md px-4 pb-24 pt-6 sm:max-w-lg sm:pb-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Sorteou</h1>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate('/admin/notifications')}
                className="relative rounded-full"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
              
              <Button onClick={() => navigate('/create')} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Nova Rifa
              </Button>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie e gerencie suas rifas de forma simples e rápida
          </p>
        </header>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Ativas
              {activeRaffles.length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {activeRaffles.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Encerradas
              {completedRaffles.length > 0 && (
                <span className="ml-1.5 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                  {completedRaffles.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-primary dark:border-neutral-700 dark:border-t-primary" />
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Carregando rifas...</p>
              </div>
            ) : activeRaffles.length > 0 ? (
              <div className="space-y-4">
                {activeRaffles.map(raffle => (
                  <RaffleCard key={raffle.id} raffle={raffle} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-neutral-100 p-4 dark:bg-neutral-800">
                  <Ticket className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Nenhuma rifa ativa</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crie uma nova rifa para começar
                </p>
                <Button onClick={() => navigate('/create')} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Rifa
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-primary dark:border-neutral-700 dark:border-t-primary" />
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Carregando rifas...</p>
              </div>
            ) : completedRaffles.length > 0 ? (
              <div className="space-y-4">
                {completedRaffles.map(raffle => (
                  <RaffleCard key={raffle.id} raffle={raffle} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-neutral-100 p-4 dark:bg-neutral-800">
                  <Ticket className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Nenhuma rifa encerrada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  As rifas encerradas aparecerão aqui
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Index;
