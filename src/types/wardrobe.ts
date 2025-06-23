
export interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear';
  color: string;
  material?: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  occasion: 'casual' | 'formal' | 'business' | 'sport' | 'party';
  imageUrl: string;
  dateAdded: string;
  lastWorn?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion: string;
  dateCreated: string;
}

export interface WeeklySchedule {
  [key: string]: {
    outfit?: Outfit;
    items: ClothingItem[];
  };
}

export interface Filters {
  category: string;
  color: string;
  season: string;
  occasion: string;
}
