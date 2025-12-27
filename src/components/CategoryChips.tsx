import { useState, memo } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const categories = [
  { id: 'todos', label: 'Todos', emoji: '🍽️' },
  { id: 'doces', label: 'Doces', emoji: '🍫' },
  { id: 'salgados', label: 'Salgados', emoji: '🥟' },
  { id: 'massas', label: 'Massas', emoji: '🍝' },
  { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
  { id: 'combos', label: 'Combos', emoji: '🎁' },
];

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryChips = memo(function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const [open, setOpen] = useState(false);

  const selectedCategory = categories.find(cat => cat.id === selected);

  const handleSelect = (categoryId: string) => {
    onSelect(categoryId);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile/Tablet: Botão com Sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-secondary hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-foreground" />
                <span className="font-medium text-foreground">Filtrar por categoria</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
                <span className="text-lg">{selectedCategory?.emoji}</span>
                <span className="text-sm font-medium text-foreground">{selectedCategory?.label}</span>
              </div>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <SheetHeader className="mb-6">
              <SheetTitle>Selecione uma categoria</SheetTitle>
              <SheetDescription>
                Escolha a categoria de produtos que deseja visualizar
              </SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  className={cn(
                    'flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 font-medium border-2',
                    selected === category.id
                      ? 'gradient-primary text-primary-foreground border-primary shadow-lg scale-105'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted border-transparent'
                  )}
                >
                  <span className="text-4xl">{category.emoji}</span>
                  <span className="text-base">{category.label}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Chips horizontais como antes */}
      <div className="hidden lg:flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm',
              selected === category.id
                ? 'gradient-primary text-primary-foreground shadow-glow'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </>
  );
});
