export interface Service {
  id: string;
  name: string;
  price: number;
  sinal: number;
  duration: string;
  durationHours: number;
  badge: string;
  symbol: string;
  description: string;
}

export const SERVICES: Record<string, Service> = {
  cilios: {
    id: 'cilios',
    name: 'Extensão de Cílios',
    price: 160.00,
    sinal: 48.00,
    duration: '2h00',
    durationHours: 2.0,
    badge: 'MAIS PROCURADO',
    symbol: '✳',
    description: 'Fio a Fio, Volume Brasileiro, Híbrido ou Russo de acordo com seu estilo.'
  },
  sobrancelhas: {
    id: 'sobrancelhas',
    name: 'Design de Sobrancelhas',
    price: 60.00,
    sinal: 18.00,
    duration: '45min',
    durationHours: 0.75,
    badge: 'DEFINIÇÃO',
    symbol: '✧',
    description: 'Mapeamento facial personalizado, limpeza precisa e finalização natural.'
  },
  manutencao: {
    id: 'manutencao',
    name: 'Manutenção de Cílios',
    price: 100.00,
    sinal: 30.00,
    duration: '1h30',
    durationHours: 1.5,
    badge: 'CUIDADO',
    symbol: '✺',
    description: 'Reposição e alinhamento dos fios para manter seu olhar impecável (até 21 dias).'
  },
  combo: {
    id: 'combo',
    name: 'Combo Cílios + Sobrancelhas',
    price: 200.00,
    sinal: 60.00,
    duration: '2h30',
    durationHours: 2.5,
    badge: 'COMPLETO',
    symbol: '★',
    description: 'A transformação visual definitiva: extensão de cílios com design alinhado.'
  }
};

export const GOOGLE_CALENDAR_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwvzsILWQaxncYqGtIQKDyWtdxh5ThprmYxQh0BDfZomXolglT1KeBO-PqTJZA9Cw0EHQ/exec';

export const PIX_CONFIG = {
  key: '+5511984814153',
  whatsappPhone: '5511984814153',
  name: 'THAIS LEITE PESSOA',
  city: 'MAUA',
  phoneDisplay: '(11) 98481-4153',
  beneficiaryDisplay: 'Thais Leite Pessoa'
};

export const MP_PUBLIC_KEY = 'TEST-35039ce6-933f-4f5d-954a-d5d72d91cfba';
