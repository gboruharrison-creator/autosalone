import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askDealerAI } from '../utils/anthropic';
import { dealer } from '../data/dealer';

interface Message { role: 'user' | 'assistant'; content: string; }

const suggestions = ['Auto sotto €15.000', 'SUV disponibili', 'Auto ibride', 'Finanziamento'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Buongiorno, sono l'assistente di ${dealer.name}. Come posso aiutarti?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    const userMsg: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const allMsgs = [...messages, userMsg];
      const reply = await askDealerAI(allMsgs.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Si è verificato un errore. Contattaci direttamente su WhatsApp.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', bottom: '88px', right: '20px', zIndex: 999,
              width: '360px', maxWidth: 'calc(100vw - 32px)',
              backgroundColor: 'white',
              boxShadow: '0 24px 64px rgba(10,10,10,0.2)',
              border: '1px solid var(--warm-gray)',
              display: 'flex', flexDirection: 'column',
              maxHeight: '520px', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              backgroundColor: 'var(--black)', padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: '12px',
              flexShrink: 0,
            }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#25D366', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 500, fontSize: '0.875rem' }}>
                  {dealer.name}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: '1px' }}>
                  Online · Risposta immediata
                </p>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem', padding: '2px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    backgroundColor: msg.role === 'user' ? 'var(--black)' : 'var(--cream)',
                    color: msg.role === 'user' ? 'white' : 'var(--text)',
                    fontSize: '0.845rem', lineHeight: 1.65,
                    fontWeight: 300,
                    borderLeft: msg.role === 'assistant' ? '2px solid var(--red)' : 'none',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: 'var(--cream)', padding: '12px 16px',
                    borderLeft: '2px solid var(--red)',
                    display: 'flex', gap: '4px', alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: '5px', height: '5px', backgroundColor: 'var(--mid-gray)',
                        borderRadius: '50%', display: 'inline-block',
                        animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{ padding: '0 20px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => send(s)}
                    style={{
                      backgroundColor: 'var(--cream)', color: 'var(--text)',
                      border: '1px solid var(--warm-gray)',
                      padding: '5px 11px', fontSize: '0.72rem',
                      fontWeight: 400, cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--black)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--warm-gray)'; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--warm-gray)',
              display: 'flex', gap: '8px', flexShrink: 0,
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Scrivi un messaggio..."
                style={{
                  flex: 1, padding: '10px 14px',
                  border: '1px solid var(--warm-gray)',
                  backgroundColor: 'var(--cream)',
                  color: 'var(--text)', fontSize: '0.845rem',
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--black)'}
                onBlur={e => e.target.style.borderColor = 'var(--warm-gray)'}
              />
              <button onClick={() => send()} disabled={loading || !input.trim()}
                style={{
                  width: '40px', height: '40px',
                  backgroundColor: input.trim() ? 'var(--red)' : 'var(--warm-gray)',
                  border: 'none', color: 'white', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s', flexShrink: 0,
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
          width: '56px', height: '56px',
          backgroundColor: 'var(--black)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(10,10,10,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}