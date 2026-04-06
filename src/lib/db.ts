import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

// ── TYPES ──
export interface DealerData {
  id?: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  whatsapp: string;
  email: string;
  lat: number;
  lng: number;
  primaryColor: string;
  plan: 'starter' | 'pro' | 'complete';
  active: boolean;
  createdAt?: any;
}

export interface CarData {
  id?: string;
  dealerId: string;
  condition: 'new' | 'used';
  status: 'available' | 'reserved' | 'sold';
  brand: string;
  model: string;
  version: string;
  year: number;
  mileage: number;
  fuel: string;
  gearbox: string;
  bodyType: string;
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
  views: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface LeadData {
  id?: string;
  dealerId: string;
  carId?: string;
  carName?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: 'form' | 'chat' | 'whatsapp';
  status: 'new' | 'contacted' | 'interested' | 'sold' | 'lost';
  notes?: string;
  createdAt?: any;
}

// ── DEALER ──
export async function createDealer(data: Omit<DealerData, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'dealers'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getDealer(id: string): Promise<DealerData | null> {
  const snap = await getDoc(doc(db, 'dealers', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as DealerData;
}

export async function getDealerByOwner(ownerId: string): Promise<DealerData | null> {
  const q = query(collection(db, 'dealers'), where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as DealerData;
}

export async function updateDealer(id: string, data: Partial<DealerData>) {
  await updateDoc(doc(db, 'dealers', id), data);
}

// ── CARS ──
export async function getCars(dealerId: string): Promise<CarData[]> {
  const q = query(
    collection(db, 'cars'),
    where('dealerId', '==', dealerId)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }) as CarData);
  return results.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });
}

export async function getCarById(id: string): Promise<CarData | null> {
  const snap = await getDoc(doc(db, 'cars', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as CarData;
}

export async function createCar(data: Omit<CarData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  // Remove all undefined values — Firestore rejects them
  const clean = Object.fromEntries(
    Object.entries({ ...data, views: 0 })
      .filter(([_, v]) => v !== undefined && v !== null)
  );
  const ref = await addDoc(collection(db, 'cars'), {
    ...clean,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCar(id: string, data: Partial<CarData>): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );
  await updateDoc(doc(db, 'cars', id), { ...clean, updatedAt: serverTimestamp() });
}

export async function deleteCar(id: string) {
  await deleteDoc(doc(db, 'cars', id));
}

// ── LEADS ──
export async function getLeads(dealerId: string): Promise<LeadData[]> {
  const q = query(
    collection(db, 'leads'),
    where('dealerId', '==', dealerId)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }) as LeadData);
  return results.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });
}

export async function createLead(data: Omit<LeadData, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'leads'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLead(id: string, data: Partial<LeadData>) {
  await updateDoc(doc(db, 'leads', id), data);
}

// ── CLOUDINARY UPLOAD ──
export async function uploadCarPhoto(file: File, dealerId: string): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `autosalone/${dealerId}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}