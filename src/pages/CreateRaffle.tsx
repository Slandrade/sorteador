
import { useNavigate } from 'react-router-dom';
import { Raffle, RaffleFormData } from '@/lib/types';
import { generateId, generateNumbers } from '@/lib/raffleMachine';
import { useRaffles } from '@/contexts/RaffleContext';
import PageTransition from '@/components/layout/PageTransition';
import RaffleForm from '@/components/raffles/RaffleForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateRaffle = () => {
  const navigate = useNavigate();
  const { addRaffle } = useRaffles();
  
  const handleSubmit = (formData: RaffleFormData) => {
    // Criar nova rifa
    const newRaffle: Raffle = {
      id: generateId(),
      ...formData,
      status: 'active',
      createdAt: new Date(),
      numbers: generateNumbers(),
      selectedNumbers: [],
    };
    
    // Adicionar ao contexto
    addRaffle(newRaffle);
    
    // Redirecionar para a página inicial
    navigate('/');
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto max-w-md px-4 pb-24 pt-6 sm:max-w-lg sm:pb-6">
        <div className="mb-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2 p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">Nova Rifa</h1>
        
        <RaffleForm onSubmit={handleSubmit} />
      </div>
    </PageTransition>
  );
};

export default CreateRaffle;
