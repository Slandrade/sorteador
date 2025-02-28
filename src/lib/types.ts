
export type RaffleStatus = 'active' | 'completed';
export type NumberStatus = 'available' | 'reserved' | 'sold';
export type NotificationType = 'reservation' | 'draw' | 'system';

export interface NumberInfo {
  number: number;
  status: NumberStatus;
  userName?: string;
  userEmail?: string;
  reservedAt?: Date;
  purchasedAt?: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  raffleId?: string;
  number?: number;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  status: RaffleStatus;
  createdAt: Date;
  drawDate?: Date;
  winningNumber?: number;
  numbers: number[];
  selectedNumbers: number[];
  numberInfo?: Record<number, NumberInfo>;
}

export type RaffleFormData = Omit<Raffle, 'id' | 'status' | 'createdAt' | 'numbers' | 'selectedNumbers' | 'winningNumber' | 'numberInfo'>;

export interface ReservationData {
  name: string;
  email: string;
  numbers: number[];
}
