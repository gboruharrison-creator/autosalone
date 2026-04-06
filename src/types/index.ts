export type CarCondition = 'new' | 'used';
export type CarStatus = 'available' | 'reserved' | 'sold';
export type FuelType = 'benzina' | 'diesel' | 'ibrido' | 'elettrico' | 'gpl' | 'metano';
export type GearboxType = 'manuale' | 'automatico' | 'semiautomatic';
export type BodyType = 'berlina' | 'suv' | 'station wagon' | 'hatchback' | 'cabrio' | 'coupé' | 'monovolume' | 'pickup';

export interface Car {
  id: string;
  condition: CarCondition;
  status: CarStatus;
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  fuel: FuelType;
  gearbox: GearboxType;
  bodyType: BodyType;
  colour: string;
  price: number;
  monthlyRate?: number;
  power: number;
  doors: number;
  seats: number;
  description: string;
  features: string[];
  photos: string[];
  warranty: number;
  co2?: number;
  consumption?: string;
  featured: boolean;
  badge?: string;
}

export interface DealerInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: { days: string; time: string }[];
  lat: number;
  lng: number;
  googleMapsUrl: string;
  founded: number;
  carsSold: number;
  rating: number;
  reviews: number;
}