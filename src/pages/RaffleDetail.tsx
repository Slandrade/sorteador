import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Raffle, ReservationData } from '@/lib/types';
import { shareResult } from '@/lib/raffleMachine';
import { useRaffles } from '@/contexts/RaffleContext';
import PageTransition from '@/components/layout/PageTransition';
import NumberGrid from '@/components/raffles/NumberGrid';
import DrawProcess from '@/components/raffles/DrawProcess';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Award, ArrowLeft, Share2, Calendar, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RaffleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRaffleById, updateRaffle, reserveNumbers } = useRaffles();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNumbersForReservation, setSelectedNumbersForReservation] = useState<number[]>([]);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [reservationData, setReservationData] = useState<{name: string; email: string}>({
    name: '',
    email: ''
  });
  const [winningNumbers, setWinningNumbers] = useState<{ number: number, name: string }[]>([]);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    const foundRaffle = getRaffleById(id);
    
    if (foundRaffle) {
      setRaffle(foundRaffle);
    } else {
      toast({
        title: "Rifa não encontrada",
        description: "A rifa que você está procurando não existe.",
        variant: "destructive",
      });
      navigate('/');
    }
    
    setIsLoading(false);
  }, [id, navigate, getRaffleById]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const data = results.data[0]; // Acessar a primeira linha do CSV
          const reservations: ReservationData[] = [];
          for (let i = 0; i < data.length; i += 2) {
            const number = Number(data[i]);
            const name = data[i + 1];
            if (!isNaN(number) && name) {
              reservations.push({ name, email: `csv-upload-${i / 2}@upload.com`, numbers: [number] });
            }
          }
          if (raffle) {
            Promise.all(reservations.map(reservation => reserveNumbers(raffle.id, reservation)))
              .then(() => {
                toast({
                  title: "CSV Carregado",
                  description: "Os números foram reservados com sucesso.",
                });
                // Atualizar a rifa localmente
                const updatedRaffle = getRaffleById(raffle.id);
                if (updatedRaffle) {
                  setRaffle(updatedRaffle);
                }
              });
          }
        },
        header: false,
      });
    }
  };

  const handleSelectNumber = (number: number) => {
    if (!raffle) return;
    
    // Se o número já está reservado ou vendido, não permitir seleção
    const numberInfo = raffle.numberInfo?.[number];
    if (numberInfo && (numberInfo.status === 'reserved' || numberInfo.status === 'sold')) {
      return;
    }
    
    // Atualizar a lista de números para reserva
    setSelectedNumbersForReservation(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number];
      }
    });
  };
  
  const handleDrawComplete = (winningNumber: number) => {
    if (!raffle) return;
    
    const winnerName = raffle.numberInfo?.[winningNumber]?.userName || 'Desconhecido';
    setWinningNumbers(prev => [...prev, { number: winningNumber, name: winnerName }]);
    
    const updatedRaffle = {
      ...raffle,
      status: 'completed' as const,
      drawDate: new Date(),
    };
    
    setRaffle(updatedRaffle);
    updateRaffle(updatedRaffle);
    
    toast({
      title: "Sorteio realizado!",
      description: `O número ${winningNumber} foi um dos vencedores.`,
    });
  };
  
  const handleShare = () => {
    if (raffle) {
      shareResult(raffle);
    }
  };
  
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!raffle) return;
    if (selectedNumbersForReservation.length === 0) {
      toast({
        title: "Nenhum número selecionado",
        description: "Por favor, selecione pelo menos um número para reservar.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reservationData.name || !reservationData.email) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha seu nome e e-mail.",
        variant: "destructive",
      });
      return;
    }
    
    // Reservar os números
    reserveNumbers(raffle.id, {
      name: reservationData.name,
      email: reservationData.email,
      numbers: selectedNumbersForReservation
    });
    
    // Limpar a seleção e fechar o diálogo
    setSelectedNumbersForReservation([]);
    setReservationDialogOpen(false);
    setReservationData({ name: '', email: '' });
    
    // Atualizar a rifa localmente
    const updatedRaffle = getRaffleById(raffle.id);
    if (updatedRaffle) {
      setRaffle(updatedRaffle);
    }
  };
  
  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-12 sm:max-w-lg">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-primary dark:border-neutral-700 dark:border-t-primary" />
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Carregando rifa...</p>
        </div>
      </PageTransition>
    );
  }
  
  if (!raffle) {
    return (
      <PageTransition>
        <div className="container mx-auto max-w-md px-4 py-12 text-center sm:max-w-lg">
          <h2 className="text-2xl font-bold">Rifa não encontrada</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">A rifa que você está procurando não existe.</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Voltar para o início
          </Button>
        </div>
      </PageTransition>
    );
  }
  
  const totalSelected = raffle.selectedNumbers.length;
  const totalNumbers = raffle.numbers.length;
  const progress = (totalSelected / totalNumbers) * 100;
  
  // Verificar se há números selecionados para reserva
  const hasSelectedForReservation = selectedNumbersForReservation.length > 0;
  
  return (
    <PageTransition>
      <div className="container mx-auto max-w-md px-4 pb-24 pt-6 sm:max-w-lg sm:pb-6">
        <div className="mb-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Badge variant={raffle.status === 'active' ? 'outline' : 'secondary'}>
            {raffle.status === 'active' ? 'Ativa' : 'Encerrada'}
          </Badge>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{raffle.title}</h1>
        
        <div className="mt-2 flex items-center space-x-2 text-primary">
          <Award className="h-5 w-5" />
          <span className="font-medium">{raffle.prize}</span>
        </div>
        
        {raffle.drawDate && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Calendar className="h-4 w-4" />
            <span>Sorteio: {raffle.drawDate.toLocaleDateString()}</span>
          </div>
        )}
        
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">{raffle.description}</p>
        
        <div className="mt-4 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">{totalSelected} de {totalNumbers} números</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark" />
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Escolha seus números</h2>
              
              {raffle.status === 'active' && hasSelectedForReservation && (
                <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Reservar ({selectedNumbersForReservation.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reservar Números</DialogTitle>
                      <DialogDescription>
                        Preencha seus dados para reservar os números selecionados.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReservationSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo</Label>
                          <Input
                            id="name"
                            placeholder="Digite seu nome"
                            value={reservationData.name}
                            onChange={(e) => setReservationData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={reservationData.email}
                            onChange={(e) => setReservationData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Números selecionados</Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedNumbersForReservation.map(num => (
                              <Badge key={num}>{num}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Confirmar Reserva</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-neutral-100 dark:bg-neutral-800"></div>
                <span className="text-sm">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <span className="text-sm">Selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                <span className="text-sm">Reservado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
                <span className="text-sm">Vendido</span>
              </div>
            </div>
            
            <NumberGrid 
              numbers={raffle.numbers} 
              selectedNumbers={
                raffle.status === 'active'
                  ? [...selectedNumbersForReservation]
                  : raffle.selectedNumbers
              }
              numberInfo={raffle.numberInfo}
              onSelectNumber={raffle.status === 'active' ? handleSelectNumber : undefined}
              isCompleted={raffle.status === 'completed'}
              winningNumber={raffle.winningNumber}
            />
          </div>
          
          <Separator />
          
          <div>
            <h2 className="mb-4 text-lg font-medium text-foreground">
              {raffle.status === 'active' ? 'Realizar Sorteio' : 'Resultado do Sorteio'}
            </h2>
            
            <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <DrawProcess 
                raffle={raffle} 
                onDrawComplete={handleDrawComplete} 
              />
            </div>
          </div>
          
          {winningNumbers.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-foreground">Números Vencedores</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {winningNumbers.map((winner, index) => (
                  <Badge key={index}>{winner.number} - {winner.name}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {raffle.status === 'completed' && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar Resultado
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default RaffleDetail;