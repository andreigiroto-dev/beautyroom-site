export interface Service {
  id: string;
  name: string;
  price: number;
  sinal: number;
  duration: string;
  durationHours: number;
  category: 'cilios' | 'sobrancelha' | 'labios' | 'combo';
  badge?: string;
  symbol?: string;
  description?: string;
}

export interface CategoryGroup {
  id: 'cilios' | 'sobrancelha' | 'labios' | 'combo';
  title: string;
  subtitle: string;
  icon: string;
  isExpandable: boolean;
  directServiceId?: string;
  services: Service[];
}

export const SERVICES: Record<string, Service> = {
  // Cílios
  'cilios-tradicionais': {
    id: 'cilios-tradicionais',
    name: 'Cílios Tradicionais e Tendências',
    price: 140.00,
    sinal: 42.00,
    duration: '2h',
    durationHours: 2.0,
    category: 'cilios',
    badge: 'DESTAQUE',
    symbol: '✨',
    description: 'Técnicas clássicas e atuais personalizadas para o seu olhar.'
  },
  'cilios-express': {
    id: 'cilios-express',
    name: 'Cílios Express',
    price: 100.00,
    sinal: 30.00,
    duration: '1h',
    durationHours: 1.0,
    category: 'cilios',
    badge: 'PRATICIDADE',
    symbol: '⚡',
    description: 'Aplicação ágil mantendo o alinhamento e elegância.'
  },
  'cilios-manutencao': {
    id: 'cilios-manutencao',
    name: 'Manutenção de Cílios',
    price: 90.00,
    sinal: 27.00,
    duration: '1h',
    durationHours: 1.0,
    category: 'cilios',
    badge: 'CUIDADO',
    symbol: '✺',
    description: 'Reposição e alinhamento dos fios (até 21 dias).'
  },
  'cilios-lash-lifting': {
    id: 'cilios-lash-lifting',
    name: 'Lash Lifting',
    price: 120.00,
    sinal: 36.00,
    duration: '1h30',
    durationHours: 1.5,
    category: 'cilios',
    badge: 'NATURAL',
    symbol: '👁️',
    description: 'Curvatura e hidratação profunda dos seus cílios naturais.'
  },

  // Sobrancelha
  'sobrancelha-design': {
    id: 'sobrancelha-design',
    name: 'Design de Sobrancelha',
    price: 35.00,
    sinal: 10.50,
    duration: '40m',
    durationHours: 0.67,
    category: 'sobrancelha',
    badge: 'ESSENCIAL',
    symbol: '✂️',
    description: 'Mapeamento facial e limpeza precisa dos fios.'
  },
  'sobrancelha-henna': {
    id: 'sobrancelha-henna',
    name: 'Design + Henna',
    price: 60.00,
    sinal: 18.00,
    duration: '1h',
    durationHours: 1.0,
    category: 'sobrancelha',
    badge: 'DEFINIÇÃO',
    symbol: '🎨',
    description: 'Design personalizado com aplicação de henna para preenchimento.'
  },
  'sobrancelha-reconstrucao': {
    id: 'sobrancelha-reconstrucao',
    name: 'Reconstrução de Sobrancelha',
    price: 90.00,
    sinal: 27.00,
    duration: '1h',
    durationHours: 1.0,
    category: 'sobrancelha',
    badge: 'TRATAMENTO',
    symbol: '🌿',
    description: 'Tratamento intensivo para estímulo e recuperação dos fios.'
  },
  'sobrancelha-brow-lamination': {
    id: 'sobrancelha-brow-lamination',
    name: 'Brow Lamination',
    price: 120.00,
    sinal: 36.00,
    duration: '1h30',
    durationHours: 1.5,
    category: 'sobrancelha',
    badge: 'TENDÊNCIA',
    symbol: '✦',
    description: 'Fios alinhados, encorpados e com efeito lifting moderno.'
  },
  'sobrancelha-micropigmentacao': {
    id: 'sobrancelha-micropigmentacao',
    name: 'Micropigmentação de Sobrancelha',
    price: 290.00,
    sinal: 87.00,
    duration: '2h',
    durationHours: 2.0,
    category: 'sobrancelha',
    badge: 'LONGA DURAÇÃO',
    symbol: '💎',
    description: 'Técnica de fios hiper-realistas com efeito duradouro.'
  },

  // Lábios
  'labios-spa-lips': {
    id: 'labios-spa-lips',
    name: 'Spa Lips',
    price: 30.00,
    sinal: 9.00,
    duration: '30m',
    durationHours: 0.5,
    category: 'labios',
    badge: 'HIDRATAÇÃO',
    symbol: '💋',
    description: 'Esfoliação suave e hidratação profunda para lábios macios.'
  },
  'labios-buco': {
    id: 'labios-buco',
    name: 'Buço',
    price: 20.00,
    sinal: 6.00,
    duration: '20m',
    durationHours: 0.33,
    category: 'labios',
    badge: 'DELICADEZA',
    symbol: '✨',
    description: 'Depilação suave e higiênica da região do buço.'
  },
  'labios-hidracolor': {
    id: 'labios-hidracolor',
    name: 'Hidracolor',
    price: 90.00,
    sinal: 27.00,
    duration: '40m',
    durationHours: 0.67,
    category: 'labios',
    badge: 'BRILHO & COR',
    symbol: '💄',
    description: 'Revitalização labial com hidratação intensa e tom coradinho.'
  },
  'labios-micropigmentacao': {
    id: 'labios-micropigmentacao',
    name: 'Micropigmentação Labial',
    price: 290.00,
    sinal: 87.00,
    duration: '2h',
    durationHours: 2.0,
    category: 'labios',
    badge: 'REVITALIZAÇÃO',
    symbol: '👑',
    description: 'Definição do contorno labial e cor saudável duradoura.'
  },

  // Combo
  'combo-cilios-sobrancelhas': {
    id: 'combo-cilios-sobrancelhas',
    name: 'Combo Cílios + Sobrancelhas',
    price: 180.00,
    sinal: 54.00,
    duration: '3h',
    durationHours: 3.0,
    category: 'combo',
    badge: 'COMBO ESPECIAL',
    symbol: '⭐',
    description: 'Harmonização completa do olhar no mesmo atendimento com valor especial.'
  }
};

export const CATEGORIES: CategoryGroup[] = [
  {
    id: 'cilios',
    title: 'Cílios',
    subtitle: 'Extensões, Manutenções & Lifting',
    icon: '👁️',
    isExpandable: true,
    services: [
      SERVICES['cilios-tradicionais'],
      SERVICES['cilios-express'],
      SERVICES['cilios-manutencao'],
      SERVICES['cilios-lash-lifting']
    ]
  },
  {
    id: 'sobrancelha',
    title: 'Sobrancelha',
    subtitle: 'Design, Henna, Lamination & Micro',
    icon: '✨',
    isExpandable: true,
    services: [
      SERVICES['sobrancelha-design'],
      SERVICES['sobrancelha-henna'],
      SERVICES['sobrancelha-reconstrucao'],
      SERVICES['sobrancelha-brow-lamination'],
      SERVICES['sobrancelha-micropigmentacao']
    ]
  },
  {
    id: 'labios',
    title: 'Lábios',
    subtitle: 'Spa Lips, Buço, Hidracolor & Micro',
    icon: '💋',
    isExpandable: true,
    services: [
      SERVICES['labios-spa-lips'],
      SERVICES['labios-buco'],
      SERVICES['labios-hidracolor'],
      SERVICES['labios-micropigmentacao']
    ]
  },
  {
    id: 'combo',
    title: 'Combo Cílios + Sobrancelhas',
    subtitle: 'Procedimento direto · R$ 180',
    icon: '⭐',
    isExpandable: false,
    directServiceId: 'combo-cilios-sobrancelhas',
    services: [
      SERVICES['combo-cilios-sobrancelhas']
    ]
  }
];

export const GOOGLE_CALENDAR_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzEl4b2doailfWpT94-igvtxICHemzfefc0Zxr3p8pWw2xzGQ77RpvCrTDtgVrveFqmhg/exec';

export const PIX_CONFIG = {
  key: '+5511984814153',
  whatsappPhone: '5511984814153',
  name: 'THAIS LEITE PESSOA',
  city: 'MAUA',
  phoneDisplay: '(11) 98481-4153',
  beneficiaryDisplay: 'Thais Leite Pessoa'
};

export const MP_PUBLIC_KEY = 'TEST-35039ce6-933f-4f5d-954a-d5d72d91cfba';
