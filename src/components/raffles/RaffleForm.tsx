
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RaffleFormData } from '@/lib/types';
import { generateId } from '@/lib/raffleMachine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RaffleFormProps {
  onSubmit: (raffle: RaffleFormData) => void;
}

const RaffleForm: React.FC<RaffleFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RaffleFormData>({
    title: '',
    description: '',
    prize: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a rifa.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.prize.trim()) {
      toast({
        title: "Prêmio obrigatório",
        description: "Por favor, informe o prêmio da rifa.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulando um pequeno delay para mostrar o loading
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      toast({
        title: "Rifa criada com sucesso!",
        description: "Sua rifa foi criada e já está disponível.",
      });
      navigate('/');
    }, 500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <div>
          <Label htmlFor="title">Título da Rifa</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ex: Rifa do Smartphone"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Descreva os detalhes da rifa..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={500}
          />
        </div>
        
        <div>
          <Label htmlFor="prize">Prêmio</Label>
          <Input
            id="prize"
            name="prize"
            placeholder="Ex: iPhone 14 Pro Max"
            value={formData.prize}
            onChange={handleChange}
            maxLength={100}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.title || !formData.prize}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Salvando...' : 'Salvar Rifa'}
        </Button>
      </div>
    </form>
  );
};

export default RaffleForm;
