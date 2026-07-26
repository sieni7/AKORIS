import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';

interface TransitionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (from: string, to: string) => Promise<void>;
  transition: { from: string; to: string } | null;
  isLoading: boolean;
}

export function TransitionModal({ open, onClose, onConfirm, transition, isLoading }: TransitionModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Transition</DialogTitle>
          <DialogDescription>
            {transition ? (
              <>Change state from <strong>{transition.from}</strong> to <strong>{transition.to}</strong>. This action will modify the project state.</>
            ) : (
              'Select a transition to confirm.'
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={() => transition && onConfirm(transition.from, transition.to)} disabled={isLoading || !transition}>
            {isLoading ? 'Transitioning...' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
