
import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRaffles } from '@/contexts/RaffleContext';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Bell,
  Check,
  ClipboardList,
  Clock,
  Eye,
  Search,
  Settings,
  ShoppingCart,
  Ticket,
  Trash,
  Users,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import NumberGrid from '@/components/raffles/NumberGrid';

const AdminDashboard = () => {
  const { raffles } = useRaffles();
  const activeCount = raffles.filter(raffle => raffle.status === 'active').length;
  const completedCount = raffles.filter(raffle => raffle.status === 'completed').length;
  
  // Total de números reservados e vendidos
  const reservations = raffles.reduce((acc, raffle) => {
    const reservedCount = Object.values(raffle.numberInfo || {}).filter(info => info.status === 'reserved').length;
    return acc + reservedCount;
  }, 0);
  
  const sales = raffles.reduce((acc, raffle) => {
    const soldCount = Object.values(raffle.numberInfo || {}).filter(info => info.status === 'sold').length;
    return acc + soldCount;
  }, 0);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Painel Administrativo</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rifas Ativas</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeCount === 1 ? 'Rifa ativa' : 'Rifas ativas'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rifas Encerradas</CardTitle>
            <Check className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {completedCount === 1 ? 'Sorteio realizado' : 'Sorteios realizados'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservations}</div>
            <p className="text-xs text-muted-foreground">
              {reservations === 1 ? 'Número reservado' : 'Números reservados'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Realizadas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales}</div>
            <p className="text-xs text-muted-foreground">
              {sales === 1 ? 'Número vendido' : 'Números vendidos'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manutenção de Rifas</CardTitle>
          <CardDescription>
            Gerenciar as rifas, confirmar pagamentos e visualizar participantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Rifas Ativas</TabsTrigger>
              <TabsTrigger value="completed">Rifas Encerradas</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <RafflesList status="active" />
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <RafflesList status="completed" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const RafflesList = ({ status }: { status: 'active' | 'completed' }) => {
  const { raffles } = useRaffles();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRaffles = raffles
    .filter(raffle => raffle.status === status)
    .filter(raffle => {
      if (!searchTerm) return true;
      return (
        raffle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        raffle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        raffle.prize.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar rifas..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredRaffles.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Prêmio</TableHead>
                <TableHead>Números</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRaffles.map((raffle) => {
                const reservedCount = Object.values(raffle.numberInfo || {}).filter(info => info.status === 'reserved').length;
                const soldCount = Object.values(raffle.numberInfo || {}).filter(info => info.status === 'sold').length;
                
                return (
                  <TableRow key={raffle.id}>
                    <TableCell className="font-medium">{raffle.title}</TableCell>
                    <TableCell>{raffle.prize}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                          {reservedCount} reservados
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {soldCount} vendidos
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {status === 'active' 
                        ? format(new Date(raffle.createdAt), "d MMM yyyy", { locale: ptBR })
                        : raffle.drawDate 
                          ? format(new Date(raffle.drawDate), "d MMM yyyy", { locale: ptBR })
                          : '-'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/raffle/${raffle.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/raffle/${raffle.id}`)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ClipboardList className="mb-2 h-10 w-10 text-neutral-400" />
          <h3 className="text-lg font-medium">Nenhuma rifa encontrada</h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {searchTerm 
              ? 'Tente ajustar sua busca.'
              : `Não há rifas ${status === 'active' ? 'ativas' : 'encerradas'} no momento.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

const NotificationCenter = () => {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useRaffles();
  const navigate = useNavigate();
  
  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    
    if (notification.raffleId) {
      navigate(`/raffle/${notification.raffleId}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notificações</h2>
        <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>
          Marcar todas como lidas
        </Button>
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <Card 
              key={notification.id} 
              className={cn(
                "cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800",
                !notification.read && "border-primary bg-primary/5 dark:bg-primary/10"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="mt-0.5">
                  {notification.type === 'reservation' ? (
                    <Clock className="h-8 w-8 text-amber-500" />
                  ) : notification.type === 'draw' ? (
                    <Ticket className="h-8 w-8 text-green-600" />
                  ) : (
                    <Bell className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {format(new Date(notification.createdAt), "d MMM HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{notification.message}</p>
                  {!notification.read && (
                    <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary dark:bg-primary/20">
                      Nova
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="mb-4 h-12 w-12 text-neutral-400" />
          <h3 className="text-lg font-medium">Nenhuma notificação</h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Todas as notificações aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
};

const RaffleAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const { raffles, getRaffleById, confirmPurchase, cancelReservation } = useRaffles();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('participants');
  
  const raffle = id ? getRaffleById(id) : undefined;
  
  if (!raffle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Rifa não encontrada</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Search className="mb-4 h-12 w-12 text-neutral-400" />
            <h3 className="text-lg font-medium">Rifa não encontrada</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              A rifa que você está procurando não existe ou foi removida.
            </p>
            <Button className="mt-4" onClick={() => navigate('/admin')}>
              Voltar para o painel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Organizar os números por status
  const reservedNumbers = Object.values(raffle.numberInfo || {}).filter(info => info.status === 'reserved');
  const soldNumbers = Object.values(raffle.numberInfo || {}).filter(info => info.status === 'sold');
  
  // Agrupar por usuário
  const userReservations: Record<string, typeof reservedNumbers> = {};
  reservedNumbers.forEach(info => {
    if (!info.userEmail) return;
    if (!userReservations[info.userEmail]) {
      userReservations[info.userEmail] = [];
    }
    userReservations[info.userEmail].push(info);
  });
  
  const handleConfirmPurchase = (numbers: number[]) => {
    confirmPurchase(raffle.id, numbers);
    toast({
      title: "Compra confirmada",
      description: `${numbers.length} número(s) confirmados como vendidos.`,
    });
  };
  
  const handleCancelReservation = (numbers: number[]) => {
    cancelReservation(raffle.id, numbers);
    toast({
      title: "Reserva cancelada",
      description: `${numbers.length} número(s) liberados.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">{raffle.title}</h2>
          <Badge variant={raffle.status === 'active' ? 'outline' : 'secondary'}>
            {raffle.status === 'active' ? 'Ativa' : 'Encerrada'}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/raffle/${raffle.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Rifa
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Rifa</CardTitle>
          <CardDescription>
            Gerenciar participantes, reservas e pagamentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="participants">Participantes</TabsTrigger>
              <TabsTrigger value="numbers">Números</TabsTrigger>
            </TabsList>
            <TabsContent value="participants" className="mt-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reservas Pendentes</h3>
                {Object.keys(userReservations).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(userReservations).map(([email, infos]) => {
                      const name = infos[0].userName || 'Usuário';
                      const numbers = infos.map(info => info.number);
                      
                      return (
                        <Card key={email}>
                          <CardContent className="p-4">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                              <div>
                                <h4 className="font-medium">{name}</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{email}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {numbers.map(num => (
                                    <Badge key={num} variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                      {num}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      <X className="mr-2 h-4 w-4" />
                                      Cancelar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja cancelar a reserva de {numbers.length} número(s) para {name}?
                                        Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleCancelReservation(numbers)}>
                                        Confirmar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                
                                <Button variant="default" size="sm" onClick={() => handleConfirmPurchase(numbers)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Confirmar Pagamento
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="mb-2 h-10 w-10 text-neutral-400" />
                    <h3 className="text-lg font-medium">Nenhuma reserva pendente</h3>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      Não há reservas pendentes para esta rifa.
                    </p>
                  </div>
                )}
                
                <Separator />
                
                <h3 className="text-lg font-medium">Pagamentos Confirmados</h3>
                {soldNumbers.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Participante</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Números</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Agrupar vendas por usuário */}
                        {Object.entries(
                          soldNumbers.reduce((acc, info) => {
                            const email = info.userEmail || 'desconhecido';
                            if (!acc[email]) {
                              acc[email] = {
                                name: info.userName || 'Usuário',
                                email,
                                numbers: [],
                                date: info.purchasedAt
                              };
                            }
                            acc[email].numbers.push(info.number);
                            return acc;
                          }, {} as Record<string, { name: string; email: string; numbers: number[]; date?: Date }>)
                        ).map(([email, data]) => (
                          <TableRow key={email}>
                            <TableCell className="font-medium">{data.name}</TableCell>
                            <TableCell>{data.email}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {data.numbers.map(num => (
                                  <Badge key={num} variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                    {num}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {data.date ? format(new Date(data.date), "d MMM yyyy", { locale: ptBR }) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ShoppingCart className="mb-2 h-10 w-10 text-neutral-400" />
                    <h3 className="text-lg font-medium">Nenhum pagamento confirmado</h3>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      Ainda não há pagamentos confirmados para esta rifa.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="numbers" className="mt-4">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Status dos Números</h3>
                <NumberGrid 
                  numbers={raffle.numbers}
                  selectedNumbers={raffle.selectedNumbers}
                  numberInfo={raffle.numberInfo}
                  isCompleted={raffle.status === 'completed'}
                  winningNumber={raffle.winningNumber}
                  showReservationInfo={true}
                />
                
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-neutral-100 dark:bg-neutral-800"></div>
                    <span className="text-sm">Disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-600"></div>
                    <span className="text-sm">Vendido</span>
                  </div>
                  {raffle.status === 'completed' && (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-success-500"></div>
                      <span className="text-sm">Vencedor</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const Admin = () => {
  const location = useLocation();
  const { notifications, unreadCount } = useRaffles();
  
  return (
    <PageTransition>
      <div className="container mx-auto max-w-5xl px-4 pb-24 pt-6 sm:pb-6">
        <div className="mb-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Painel Administrativo</h1>
            <div className="flex items-center space-x-4">
              <Link to="/admin/notifications">
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Ticket className="mr-2 h-4 w-4" />
                  Ver Rifas
                </Button>
              </Link>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie rifas, participantes e acompanhe o andamento dos sorteios.
          </p>
        </div>
        
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/raffle/:id" element={<RaffleAdmin />} />
        </Routes>
      </div>
    </PageTransition>
  );
};

export default Admin;
