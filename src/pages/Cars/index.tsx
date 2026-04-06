import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { cars, getBrands } from '../../data/cars';
import { dealer } from '../../data/dealer';
import CarCard from '../../components/CarCard';
import type { CarCondition, FuelType } from '../../types';

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [condition, setCondition] = useState<CarCondition | 'all'>((searchParams.get('condizione') as CarCondition) || 'all');
  const [brand, setBrand] = useState(searchParams.get('marca') || 'all');
  const [fuel, setFuel] = useState<FuelType | 'all'>('all');
  const [maxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('featured');
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const c = searchParams.get('condizione') as CarCondition;
    if (c) setCondition(c);
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const brands = getBrands();
  const newCount = cars.filter(c => c.condition === 'new').length;
  const usedCount = cars.filter(c => c.condition === 'used').length;

  const filtered = useMemo(() => {
    let result = [...cars];
    if (condition !== 'all') result = result.filter(c => c.condition === condition);
    if (brand !== 'all') result = result.filter(c => c.brand === brand);
    if (fuel !== 'all') result = result.filter(c => c.fuel === fuel);
    result = result.filter(c => c.price <= maxPrice);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.version.toLowerCase().includes(q) ||
        String(c.year).includes(q)
      );
    }
    switch (sortBy) {
      case 'price_asc': return result.sort((a, b) => a.price - b.price);
      case 'price_desc': return result.sort((a, b) => b.price - a.price);
      case 'year_desc': return result.sort((a, b) => b.year - a.year);
      case 'mileage_asc': return result.sort((a, b) => a.mileage - b.mileage);
      default: return result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [condition, brand, fuel, maxPrice, search, sortBy]);

  const selectStyle = {
    padding: '10px 14px', border: '1px solid var(--warm-gray)',
    backgroundColor: 'white', color: 'var(--text)',
    fontSize: '0.82rem', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    transition: 'border-color 0.2s',
    appearance: 'none' as const, WebkitAppearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8680' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '32px',
  };

  const hasFilters = condition !== 'all' || brand !== 'all' || fuel !== 'all' || search !== '';

  const resetFilters = () => {
    setCondition('all');
    setBrand('all');
    setFuel('all');
    setSearch('');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>
          {condition === 'new' ? 'Auto Nuove' : condition === 'used' ? 'Auto Usate' : 'Tutti i Veicoli'} — {dealer.name}
        </title>
        <meta name="description" content={`${filtered.length} veicoli disponibili presso ${dealer.name} a ${dealer.city}.`} />
      </Helmet>

      {/* Page header */}
      <div style={{
        backgroundColor: 'var(--black)',
        padding: '100px 2rem 48px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ color: 'var(--red)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>
            {dealer.name}
          </p>
          <h1 className="serif" style={{
            color: 'white', fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 400, lineHeight: 1.1, marginBottom: '24px',
          }}>
            {condition === 'new' ? 'Auto Nuove' : condition === 'used' ? 'Auto Usate' : 'Tutti i Veicoli'}
          </h1>

          {/* Condition tabs */}
          <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
            {[
              { value: 'all', label: `Tutti · ${cars.length}` },
              { value: 'new', label: `Nuove · ${newCount}` },
              { value: 'used', label: `Usate · ${usedCount}` },
            ].map(tab => (
              <button key={tab.value}
                onClick={() => {
                  setCondition(tab.value as CarCondition | 'all');
                  setSearchParams(tab.value !== 'all' ? { condizione: tab.value } : {});
                }}
                style={{
                  padding: '9px 22px',
                  backgroundColor: condition === tab.value ? 'var(--red)' : 'rgba(255,255,255,0.06)',
                  color: condition === tab.value ? 'white' : 'rgba(255,255,255,0.5)',
                  border: 'none', cursor: 'pointer',
                  fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.06em',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (condition !== tab.value) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; } }}
                onMouseLeave={e => { if (condition !== tab.value) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--warm-gray)',
        padding: '14px 2rem',
        position: 'sticky', top: '68px', zIndex: 40,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--mid-gray)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cerca marca, modello..."
              style={{
                width: '100%', padding: '10px 14px 10px 34px',
                border: '1px solid var(--warm-gray)', backgroundColor: 'white',
                color: 'var(--text)', fontSize: '0.82rem',
                outline: 'none', fontFamily: 'DM Sans, sans-serif',
                transition: 'border-color 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--black)'}
              onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'}
            />
          </div>

          {/* Brand */}
          <select value={brand} onChange={e => setBrand(e.target.value)} style={selectStyle}>
            <option value="all">Tutte le marche</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Fuel */}
          <select value={fuel} onChange={e => setFuel(e.target.value as FuelType | 'all')} style={selectStyle}>
            <option value="all">Carburante</option>
            {['benzina', 'diesel', 'ibrido', 'elettrico', 'gpl', 'metano'].map(f => (
              <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
            ))}
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
            <option value="featured">In evidenza</option>
            <option value="price_asc">Prezzo crescente</option>
            <option value="price_desc">Prezzo decrescente</option>
            <option value="year_desc">Anno più recente</option>
            <option value="mileage_asc">Meno km</option>
          </select>

          {/* Results count + reset */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: 'var(--mid-gray)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              {filtered.length} risultat{filtered.length === 1 ? 'o' : 'i'}
            </span>
            {hasFilters && (
              <button onClick={resetFilters} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--red)', fontSize: '0.75rem', fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em',
                padding: 0,
              }}>
                Azzera filtri
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ backgroundColor: 'var(--cream)', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 2rem' }}>
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '100px 20px' }}>
                <p className="serif" style={{ color: 'var(--black)', fontSize: '2rem', fontWeight: 400, marginBottom: '12px' }}>
                  Nessun risultato
                </p>
                <p style={{ color: 'var(--mid-gray)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 300 }}>
                  Prova a modificare i filtri di ricerca
                </p>
                <button onClick={resetFilters} style={{
                  backgroundColor: 'var(--red)', color: 'white',
                  border: 'none', padding: '12px 28px',
                  fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em',
                }}>
                  Azzera filtri
                </button>
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2px',
                }}>
                {filtered.map((car, i) => (
                  <motion.div key={car.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}>
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}