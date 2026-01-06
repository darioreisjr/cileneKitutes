import { useState, memo, useMemo } from 'react';
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
import { useCategories } from '@/hooks/useCategories';

// Mapeamento de emojis por categoria (pode ser configurável depois)
const categoryEmojis: Record<string, string> = {
  'todos': '🍽️',
  'doces': '🍫',
  'salgados': '🥟',
  'massas': '🍝',
  'bebidas': '🥤',
  'combos': '🎁',
};

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryChips = memo(function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const [open, setOpen] = useState(false);
  const { categories: dbCategories, loading } = useCategories();

  // Combinar categoria "Todos" com as do banco
  const categories = useMemo(() => {
    const allCategories = [
      { id: 'todos', slug: 'todos', name: 'Todos', emoji: '🍽️' },
      ...dbCategories.map(cat => ({
        id: cat.slug,
        slug: cat.slug,
        name: cat.name,
        emoji: categoryEmojis[cat.slug] || '📦',
      })),
    ];
    return allCategories;
  }, [dbCategories]);

  const selectedCategory = categories.find(cat => cat.id === selected);

  const handleSelect = (categoryId: string) => {
    onSelect(categoryId);
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 w-24 bg-secondary rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile/Tablet: Botão com Sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-secondary hover:bg-muted transition-colors" aria-label={`Filtrar por categoria. Categoria selecionada: ${selectedCategory?.name}`}>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-foreground" aria-hidden="true" />
                <span className="font-medium text-foreground">Filtrar por categoria</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
                <span className="text-lg" aria-hidden="true">{selectedCategory?.emoji}</span>
                <span className="text-sm font-medium text-foreground">{selectedCategory?.name}</span>
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
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Categorias de produtos">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  role="radio"
                  aria-checked={selected === category.id}
                  aria-label={category.name}
                  className={cn(
                    'flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300 font-medium border-2',
                    selected === category.id
                      ? 'gradient-primary text-primary-foreground border-primary shadow-lg scale-105'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted border-transparent'
                  )}
                >
                  <span className="text-4xl" aria-hidden="true">{category.emoji}</span>
                  <span className="text-base">{category.name}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Chips horizontais como antes */}
      <div className="hidden lg:flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="radiogroup" aria-label="Categorias de produtos">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            role="radio"
            aria-checked={selected === category.id}
            aria-label={category.name}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm',
              selected === category.id
                ? 'gradient-primary text-primary-foreground shadow-glow'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
          >
            <span aria-hidden="true">{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </>
  );
});
