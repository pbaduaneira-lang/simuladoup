import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  placeholder: string;
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export function ActionModal({ open, onOpenChange, title, description, placeholder, onSubmit, isLoading }: ActionModalProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-2 border-border neo-brutalism sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <textarea
            className="w-full bg-[#141417] border border-[#1F1F23] rounded-xl p-4 focus:outline-none focus:border-primary transition-colors text-white resize-none h-32"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!text.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold"
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
