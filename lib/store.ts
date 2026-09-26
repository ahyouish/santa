// Store and shared state for Wish System
export interface Wish {
  id: string;
  childName: string;
  age: number;
  location: string;
  wishText: string;
  category: string;
  emoji: string;
  status: 'pending' | 'approved' | 'rejected';
  safetyStatus: 'safe' | 'flagged' | 'review';
  safetyReason: string;
  listType: 'good' | 'naughty';
  avatar: string;
  goodDeeds?: string;
  createdAt: string;
  deliveryStatus?: 'workshop' | 'wrapping' | 'loaded' | 'in_flight' | 'delivered';
  deliveryProgress?: number; // 0 to 100
  elfAssigned?: string;
  deliveryAddress?: string;
}

export const INITIAL_WISHES: Wish[] = [
  {
    id: 'wish-1',
    childName: 'Tom',
    age: 8,
    location: 'London, United Kingdom',
    wishText: 'A magical bunny ride around the world.',
    category: 'Experience',
    emoji: '🌍',
    status: 'pending',
    safetyStatus: 'safe',
    safetyReason: 'No harmful or inappropriate content detected. Promotes gentle imagination and global curiosity.',
    listType: 'good',
    avatar: '/avatars/tom.jpg',
    goodDeeds: 'Cleaned his room every Saturday without complaining, and helped grandpa water the tomato plants.',
    createdAt: '2026-12-23T10:14:00Z',
    deliveryStatus: 'workshop',
    deliveryProgress: 20,
    elfAssigned: 'Elf Pepper Sparks',
    deliveryAddress: '42 Primrose Lane, London, UK'
  },
  {
    id: 'wish-2',
    childName: 'Emma',
    age: 6,
    location: 'Seattle, United States',
    wishText: 'A new telescope to see the stars.',
    category: 'Learning',
    emoji: '🔭',
    status: 'pending',
    safetyStatus: 'safe',
    safetyReason: 'No harmful or inappropriate content detected. Safe optical astronomy telescope with shatterproof glass.',
    listType: 'good',
    avatar: '/avatars/emma.jpg',
    goodDeeds: 'Shared crayons at kindergarten and comforted a crying friend on the playground.',
    createdAt: '2026-12-23T11:05:00Z',
    deliveryStatus: 'workshop',
    deliveryProgress: 15,
    elfAssigned: 'Elf Pipsqueak Finch',
    deliveryAddress: '88 Evergreen Way, Seattle, WA'
  },
  {
    id: 'wish-3',
    childName: 'Jack',
    age: 10,
    location: 'Melbourne, Australia',
    wishText: 'A racing car set.',
    category: 'Toys',
    emoji: '🏎️',
    status: 'pending',
    safetyStatus: 'safe',
    safetyReason: 'No harmful or inappropriate content detected. Low-voltage magnetic track meets all EU/US safety toys standards.',
    listType: 'good',
    avatar: '/avatars/jack.jpg',
    goodDeeds: 'Helped neighbors rake garden leaves and looked after the school rabbit.',
    createdAt: '2026-12-23T12:20:00Z',
    deliveryStatus: 'workshop',
    deliveryProgress: 10,
    elfAssigned: 'Elf Twinkle Toes',
    deliveryAddress: '15 Wattle Crescent, Melbourne, VIC'
  },
  {
    id: 'wish-4',
    childName: 'Mia',
    age: 7,
    location: 'Paris, France',
    wishText: 'A drawing kit with lots of colours.',
    category: 'Arts & Crafts',
    emoji: '🎨',
    status: 'pending',
    safetyStatus: 'safe',
    safetyReason: 'No harmful or inappropriate content detected. Non-toxic washable watercolours and FSC-certified paper.',
    listType: 'good',
    avatar: '/avatars/mia.jpg',
    goodDeeds: 'Always remembered magic words (please & thank you) and baked holiday cookies with grandma.',
    createdAt: '2026-12-23T13:45:00Z',
    deliveryStatus: 'workshop',
    deliveryProgress: 25,
    elfAssigned: 'Elf Sugarplum Frost',
    deliveryAddress: '7 Rue de la Paix, Paris, France'
  },
  {
    id: 'wish-5',
    childName: 'Alex',
    age: 9,
    location: 'Toronto, Canada',
    wishText: 'A drone.',
    category: 'Technology',
    emoji: '🚁',
    status: 'pending',
    safetyStatus: 'safe',
    safetyReason: 'No harmful or inappropriate content detected. Equipped with full propeller safety cage and indoor altitude hold.',
    listType: 'good',
    avatar: '/avatars/alex.jpg',
    goodDeeds: 'Taught younger sister how to tie her shoelaces and collected recycle bins on his street.',
    createdAt: '2026-12-23T14:10:00Z',
    deliveryStatus: 'workshop',
    deliveryProgress: 30,
    elfAssigned: 'Elf Gizmo Spark',
    deliveryAddress: '304 Maple Leaf Boulevard, Toronto, ON'
  },
  {
    id: 'wish-6',
    childName: 'Sophia',
    age: 5,
    location: 'Stockholm, Sweden',
    wishText: 'A warm fluffy teddy bear that plays bedtime lullabies.',
    category: 'Plush & Comfort',
    emoji: '🧸',
    status: 'approved',
    safetyStatus: 'safe',
    safetyReason: 'Passed strict softness and acoustic volume standards. Perfectly safe for bedtime warmth.',
    listType: 'good',
    avatar: '/avatars/mia.jpg',
    goodDeeds: 'Ate all her broccoli without making faces and read bedtime stories to her kitten.',
    createdAt: '2026-12-22T09:30:00Z',
    deliveryStatus: 'loaded',
    deliveryProgress: 80,
    elfAssigned: 'Elf Snowflake Ribbon',
    deliveryAddress: '12 Drottninggatan, Stockholm, Sweden'
  },
  {
    id: 'wish-7',
    childName: 'Lucas',
    age: 11,
    location: 'Chicago, United States',
    wishText: 'A slingshot to target squirrels in the backyard.',
    category: 'Outdoors',
    emoji: '🎯',
    status: 'rejected',
    safetyStatus: 'flagged',
    safetyReason: 'AI Flag: Harmful intent towards wildlife detected. Violates Christmas Spirit Kindness Directive 4.2.',
    listType: 'naughty',
    avatar: '/avatars/jack.jpg',
    goodDeeds: 'Pulled cat tail twice and refused to do dishes.',
    createdAt: '2026-12-22T14:15:00Z',
    deliveryStatus: 'workshop',
    deliveryProgress: 0,
    elfAssigned: 'Elf Grumpy Coal-Keeper',
    deliveryAddress: '55 Michigan Ave, Chicago, IL'
  }
];

const STORAGE_KEY = 'santa_wish_system_data_v1';

export function getWishes(): Wish[] {
  if (typeof window === 'undefined') return INITIAL_WISHES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WISHES));
      return INITIAL_WISHES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load wishes from localStorage:', err);
    return INITIAL_WISHES;
  }
}

export function saveWishes(wishes: Wish[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    window.dispatchEvent(new CustomEvent('wish-store-updated', { detail: wishes }));
  } catch (err) {
    console.error('Failed to save wishes to localStorage:', err);
  }
}

export function addWish(wishData: Omit<Wish, 'id' | 'createdAt' | 'status' | 'deliveryStatus' | 'deliveryProgress'>): Wish {
  const wishes = getWishes();
  
  // AI Safety evaluation heuristic
  const text = (wishData.wishText || '').toLowerCase();
  const harmKeywords = ['gun', 'weapon', 'hurt', 'fight', 'slingshot', 'explosive', 'bullet', 'knife', 'poison', 'target animals'];
  const hasHarm = harmKeywords.some(k => text.includes(k));

  let safetyStatus: 'safe' | 'flagged' | 'review' = 'safe';
  let safetyReason = 'No harmful or inappropriate content detected. Verified cheerful and age-appropriate.';
  let listType: 'good' | 'naughty' = wishData.listType || 'good';

  if (hasHarm) {
    safetyStatus = 'flagged';
    safetyReason = 'AI Safety Flag: Detected keywords that violate North Pole safe toys & kindness guidelines.';
    listType = 'naughty';
  }

  const newWish: Wish = {
    ...wishData,
    id: 'wish-' + Date.now(),
    status: 'pending',
    safetyStatus,
    safetyReason,
    listType,
    createdAt: new Date().toISOString(),
    deliveryStatus: 'workshop',
    deliveryProgress: 10,
    elfAssigned: ['Elf Jingleberry', 'Elf Sugarplum', 'Elf Nutmeg', 'Elf Sparkle'][Math.floor(Math.random() * 4)]
  };

  const updated = [newWish, ...wishes];
  saveWishes(updated);
  return newWish;
}

export function updateWishStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Wish | null {
  const wishes = getWishes();
  let updatedWish: Wish | null = null;

  const updated = wishes.map(w => {
    if (w.id === id) {
      let deliveryStatus = w.deliveryStatus;
      if (status === 'approved' && (!deliveryStatus || deliveryStatus === 'workshop')) {
        deliveryStatus = 'workshop';
      }
      updatedWish = {
        ...w,
        status,
        deliveryStatus,
        deliveryProgress: status === 'approved' ? Math.max(w.deliveryProgress || 20, 20) : 0
      };
      return updatedWish;
    }
    return w;
  });

  saveWishes(updated);
  return updatedWish;
}

export function updateDeliveryProgress(id: string, nextStatus: Wish['deliveryStatus'], progress: number): Wish | null {
  const wishes = getWishes();
  let updatedWish: Wish | null = null;

  const updated = wishes.map(w => {
    if (w.id === id) {
      updatedWish = {
        ...w,
        deliveryStatus: nextStatus,
        deliveryProgress: progress
      };
      return updatedWish;
    }
    return w;
  });

  saveWishes(updated);
  return updatedWish;
}

export function resetDefaultWishes(): Wish[] {
  saveWishes(INITIAL_WISHES);
  return INITIAL_WISHES;
}
