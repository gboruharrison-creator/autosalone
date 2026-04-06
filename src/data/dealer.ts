import type { DealerInfo } from '../types';

export const dealer: DealerInfo = {
  name: 'AutoSalone Demo',
  tagline: 'La tua concessionaria di fiducia dal 1998',
  address: 'Via Roma 47',
  city: 'Campobasso',
  province: 'CB',
  phone: '+39 0874 123456',
  whatsapp: '393511234567',
  email: 'info@autosaloneDemo.it',
  hours: [
    { days: 'Lunedì — Venerdì', time: '9:00 — 13:00 / 15:00 — 19:00' },
    { days: 'Sabato', time: '9:00 — 13:00 / 15:00 — 18:00' },
    { days: 'Domenica', time: 'Chiuso' },
  ],
  lat: 41.5602,
  lng: 14.6627,
  googleMapsUrl: 'https://maps.google.com/?q=Campobasso,CB',
  founded: 1998,
  carsSold: 2840,
  rating: 4.8,
  reviews: 312,
};