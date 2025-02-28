
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Raffle, Notification, ReservationData, NumberInfo, NumberStatus } from '@/lib/types';
import { generateNumbers, generateId } from '@/lib/raffleMachine';
import { toast } from '@/hooks/use-toast';

// Dados iniciais de exemplo
const initialRaffles: Raffle[] = [
  {
    id: '1',
    title: 'Rifa do Smartphone',
    description: 'Concorra a um iPhone 14 Pro Max novinho!',
    prize: 'iPhone 14 Pro Max',
    status: 'active',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    numbers: generateNumbers(),
    selectedNumbers: [1, 5, 7, 12, 15, 18],
    numberInfo: {
      1: { number: 1, status: 'reserved', userName: 'João Silva', userEmail: 'joao@email.com', reservedAt: new Date() },
      5: { number: 5, status: 'sold', userName: 'Maria Souza', userEmail: 'maria@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      7: { number: 7, status: 'reserved', userName: 'Carlos Oliveira', userEmail: 'carlos@email.com', reservedAt: new Date() },
      12: { number: 12, status: 'sold', userName: 'Ana Costa', userEmail: 'ana@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      15: { number: 15, status: 'reserved', userName: 'Paulo Santos', userEmail: 'paulo@email.com', reservedAt: new Date() },
      18: { number: 18, status: 'sold', userName: 'Lucia Pereira', userEmail: 'lucia@email.com', reservedAt: new Date(), purchasedAt: new Date() },
    }
  },
  {
    id: '2',
    title: 'Rifa Beneficente',
    description: 'Toda a renda será doada para o abrigo de animais.',
    prize: 'Smart TV 50"',
    status: 'active',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 dias atrás
    numbers: generateNumbers(),
    selectedNumbers: [2, 3, 9, 14, 22, 29],
    numberInfo: {
      2: { number: 2, status: 'sold', userName: 'Fernando Lima', userEmail: 'fernando@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      3: { number: 3, status: 'reserved', userName: 'Carla Dias', userEmail: 'carla@email.com', reservedAt: new Date() },
      9: { number: 9, status: 'sold', userName: 'Roberto Alves', userEmail: 'roberto@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      14: { number: 14, status: 'reserved', userName: 'Patricia Melo', userEmail: 'patricia@email.com', reservedAt: new Date() },
      22: { number: 22, status: 'sold', userName: 'Marcelo Costa', userEmail: 'marcelo@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      29: { number: 29, status: 'reserved', userName: 'Juliana Rocha', userEmail: 'juliana@email.com', reservedAt: new Date() },
    }
  },
  {
    id: '3',
    title: 'Rifa do Console',
    description: 'PlayStation 5 com dois controles e 3 jogos.',
    prize: 'PlayStation 5',
    status: 'completed',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 dias atrás
    drawDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    winningNumber: 17,
    numbers: generateNumbers(),
    selectedNumbers: [2, 5, 8, 10, 13, 17, 19, 21, 25, 28],
    numberInfo: {
      2: { number: 2, status: 'sold', userName: 'Diego Silva', userEmail: 'diego@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      5: { number: 5, status: 'sold', userName: 'Camila Rodrigues', userEmail: 'camila@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      8: { number: 8, status: 'sold', userName: 'Gustavo Santos', userEmail: 'gustavo@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      10: { number: 10, status: 'sold', userName: 'Amanda Lima', userEmail: 'amanda@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      13: { number: 13, status: 'sold', userName: 'Lucas Oliveira', userEmail: 'lucas@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      17: { number: 17, status: 'sold', userName: 'Bruna Costa', userEmail: 'bruna@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      19: { number: 19, status: 'sold', userName: 'Renato Pereira', userEmail: 'renato@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      21: { number: 21, status: 'sold', userName: 'Daniela Alves', userEmail: 'daniela@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      25: { number: 25, status: 'sold', userName: 'Rafael Souza', userEmail: 'rafael@email.com', reservedAt: new Date(), purchasedAt: new Date() },
      28: { number: 28, status: 'sold', userName: 'Fernanda Santana', userEmail: 'fernanda@email.com', reservedAt: new Date(), purchasedAt: new Date() },
    }
  },
];

// Notificações iniciais de exemplo
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'reservation',
    title: 'Novo número reservado',
    message: 'João Silva reservou o número 1 na rifa "Rifa do Smartphone"',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: false,
    raffleId: '1',
    number: 1
  },
  {
    id: '2',
    type: 'draw',
    title: 'Sorteio realizado',
    message: 'O número 17 foi sorteado na rifa "Rifa do Console"',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    raffleId: '3',
    number: 17
  },
  {
    id: '3',
    type: 'system',
    title: 'Bem-vindo ao Sorteou!',
    message: 'Bem-vindo à plataforma de rifas. Crie sua primeira rifa agora!',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true
  }
];

interface RaffleContextType {
  raffles: Raffle[];
  notifications: Notification[];
  unreadCount: number;
  addRaffle: (raffle: Raffle) => void;
  updateRaffle: (raffle: Raffle) => void;
  getRaffleById: (id: string) => Raffle | undefined;
  reserveNumbers: (raffleId: string, data: ReservationData) => void;
  confirmPurchase: (raffleId: string, numbers: number[]) => void;
  cancelReservation: (raffleId: string, numbers: number[]) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export const useRaffles = () => {
  const context = useContext(RaffleContext);
  if (!context) {
    throw new Error('useRaffles must be used within a RaffleProvider');
  }
  return context;
};

interface RaffleProviderProps {
  children: ReactNode;
}

export const RaffleProvider: React.FC<RaffleProviderProps> = ({ children }) => {
  const [raffles, setRaffles] = useState<Raffle[]>(initialRaffles);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addRaffle = (raffle: Raffle) => {
    setRaffles(prev => [raffle, ...prev]);
    
    // Criar notificação
    addNotification({
      type: 'system',
      title: 'Nova rifa criada',
      message: `A rifa "${raffle.title}" foi criada com sucesso.`,
      raffleId: raffle.id
    });
    
    toast({
      title: "Rifa criada com sucesso!",
      description: "Sua rifa foi adicionada à lista de rifas ativas.",
    });
  };

  const updateRaffle = (updatedRaffle: Raffle) => {
    setRaffles(prev => 
      prev.map(raffle => raffle.id === updatedRaffle.id ? updatedRaffle : raffle)
    );
  };

  const getRaffleById = (id: string) => {
    return raffles.find(raffle => raffle.id === id);
  };

  const reserveNumbers = (raffleId: string, reservationData: ReservationData): Promise<void> => {
    return new Promise((resolve, reject) => {
      setRaffles(prev => {
        const updatedRaffles = prev.map(raffle => {
          if (raffle.id !== raffleId) return raffle;
  
          const { name, email, numbers } = reservationData;
  
          // Adicionar os números à lista de selecionados se não estiverem lá
          const newSelectedNumbers = [...new Set([...raffle.selectedNumbers, ...numbers])];
  
          // Atualizar as informações de cada número
          const updatedNumberInfo = { ...raffle.numberInfo };
          numbers.forEach(num => {
            updatedNumberInfo[num] = {
              number: num,
              status: 'reserved',
              userName: name,
              userEmail: email,
              reservedAt: new Date()
            };
          });
  
          return {
            ...raffle,
            selectedNumbers: newSelectedNumbers,
            numberInfo: updatedNumberInfo
          };
        });
  
        return updatedRaffles;
      });
  
      // Criar notificação
      const raffle = getRaffleById(raffleId);
      if (raffle) {
        addNotification({
          type: 'reservation',
          title: 'Novos números reservados',
          message: `${reservationData.name} reservou ${reservationData.numbers.length} número(s) na rifa "${raffle.title}"`,
          raffleId,
          number: reservationData.numbers[0]
        });
      }
  
      toast({
        title: "Reserva realizada!",
        description: `${reservationData.numbers.length} número(s) reservados com sucesso.`,
      });
  
      resolve();
    });
  };
 
  const confirmPurchase = (raffleId: string, numbers: number[]) => {
    setRaffles(prev => {
      return prev.map(raffle => {
        if (raffle.id !== raffleId) return raffle;

        // Atualizar as informações de cada número
        const updatedNumberInfo = { ...raffle.numberInfo };
        numbers.forEach(num => {
          if (updatedNumberInfo[num]) {
            updatedNumberInfo[num].status = 'sold';
            updatedNumberInfo[num].purchasedAt = new Date();
          }
        });

        return {
          ...raffle,
          numberInfo: updatedNumberInfo
        };
      });
    });

    toast({
      title: "Compra confirmada!",
      description: `${numbers.length} número(s) comprados com sucesso.`,
    });
  };

  const cancelReservation = (raffleId: string, numbers: number[]) => {
    setRaffles(prev => {
      return prev.map(raffle => {
        if (raffle.id !== raffleId) return raffle;
        
        // Remover os números da lista de selecionados
        const newSelectedNumbers = raffle.selectedNumbers.filter(num => !numbers.includes(num));
        
        // Remover as informações de cada número
        const updatedNumberInfo = { ...raffle.numberInfo };
        numbers.forEach(num => {
          delete updatedNumberInfo[num];
        });
        
        return {
          ...raffle,
          selectedNumbers: newSelectedNumbers,
          numberInfo: updatedNumberInfo
        };
      });
    });
    
    toast({
      title: "Reserva cancelada!",
      description: `${numbers.length} número(s) liberados.`,
      variant: "destructive"
    });
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <RaffleContext.Provider value={{ 
      raffles, 
      notifications, 
      unreadCount,
      addRaffle, 
      updateRaffle, 
      getRaffleById,
      reserveNumbers,
      confirmPurchase,
      cancelReservation,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      addNotification
    }}>
      {children}
    </RaffleContext.Provider>
  );
};
