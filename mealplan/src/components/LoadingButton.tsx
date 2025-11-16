import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton = ({ 
  loading = false, 
  loadingText = 'Loading...', 
  children, 
  disabled,
  ...props 
}: LoadingButtonProps) => {
  return (
    <Button 
      disabled={loading || disabled} 
      className="relative overflow-hidden"
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {loading ? loadingText : children}
    </Button>
  );
};