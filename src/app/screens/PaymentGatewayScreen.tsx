import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, ChevronDown, ChevronUp, X, Check, User, Lock } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

// ─── Razorpay brand colors (fixed, not theme-dependent) ──────────────────────
const RPZ = {
  headerBg:   '#2C6EEC',
  headerText: '#FFFFFF',
  green:      '#00B14F',
  black:      '#1A1A1A',
  bodyBg:     '#F5F6FA',
  cardBg:     '#FFFFFF',
  border:     '#E8EAF0',
  textPrimary:'#1A1A1A',
  textSub:    '#666E7B',
  textMuted:  '#9EA8B5',
};

// ─── Payment method data ──────────────────────────────────────────────────────

type MethodId = 'cards' | 'netbanking' | 'wallet' | 'paylater' | 'upi';

const METHODS: { id: MethodId; label: string; icon: string; logos: { label: string; color: string; bg: string }[] }[] = [
  {
    id: 'cards', label: 'Cards',
    icon: '💳',
    logos: [
      { label: 'VISA',   color: '#1A1F71', bg: '#EEF0FF' },
      { label: 'MC',     color: '#EB001B', bg: '#FFF0F0' },
      { label: 'RuPay',  color: '#00796B', bg: '#E0F7F4' },
    ],
  },
  {
    id: 'netbanking', label: 'Netbanking',
    icon: '🏛️',
    logos: [
      { label: 'BOB',    color: '#E65100', bg: '#FFF3E0' },
      { label: 'Canara', color: '#1565C0', bg: '#E3F2FD' },
      { label: 'SBI',    color: '#283593', bg: '#E8EAF6' },
    ],
  },
  {
    id: 'upi', label: 'UPI',
    icon: '📲',
    logos: [
      { label: 'GPay',   color: '#34A853', bg: '#E8F5E9' },
      { label: 'PhonePe',color: '#5F259F', bg: '#F3E5F5' },
      { label: 'Paytm',  color: '#002970', bg: '#E3F2FD' },
    ],
  },
  {
    id: 'wallet', label: 'Wallet',
    icon: '👛',
    logos: [
      { label: 'Paytm',  color: '#002970', bg: '#E3F2FD' },
      { label: 'AmazonPay', color: '#FF9900', bg: '#FFF8E1' },
      { label: 'Mobikwik', color: '#1565C0', bg: '#E3F2FD' },
    ],
  },
  {
    id: 'paylater', label: 'Pay Later',
    icon: '🕐',
    logos: [
      { label: 'LazyPay', color: '#E53935', bg: '#FFEBEE' },
      { label: 'ICICI',   color: '#B71C1C', bg: '#FFEBEE' },
      { label: 'ZestMoney', color: '#7B1FA2', bg: '#F3E5F5' },
    ],
  },
];

const BANKS = [
  { id: 'bob',    label: 'BOB',          color: '#E65100', bg: '#FFF3E0' },
  { id: 'canara', label: 'Canara B...',   color: '#1565C0', bg: '#E3F2FD' },
  { id: 'pnb',    label: 'PNB',          color: '#827717', bg: '#F9FBE7' },
  { id: 'pnbe',   label: 'PNB (Erst...)',color: '#2E7D32', bg: '#E8F5E9' },
  { id: 'sbi',    label: 'SBI',          color: '#283593', bg: '#E8EAF6' },
  { id: 'hdfc',   label: 'HDFC',         color: '#880E4F', bg: '#FCE4EC' },
  { id: 'icici',  label: 'ICICI',        color: '#B71C1C', bg: '#FFEBEE' },
  { id: 'axis',   label: 'Axis',         color: '#1B5E20', bg: '#E8F5E9' },
];

const UPI_APPS = [
  { id: 'gpay',    label: 'Google Pay',  color: '#34A853', bg: '#E8F5E9' },
  { id: 'phonepe', label: 'PhonePe',     color: '#5F259F', bg: '#F3E5F5' },
  { id: 'paytm',   label: 'Paytm',       color: '#002970', bg: '#E3F2FD' },
  { id: 'bhim',    label: 'BHIM',        color: '#FF6600', bg: '#FFF3E0' },
];

const WALLETS = [
  { id: 'paytmw',  label: 'Paytm Wallet',  color: '#002970', bg: '#E3F2FD',  balance: '₹1,240' },
  { id: 'amazon',  label: 'Amazon Pay',    color: '#FF9900', bg: '#FFF8E1',  balance: '₹800' },
  { id: 'mobikwik',label: 'Mobikwik',      color: '#1565C0', bg: '#E3F2FD',  balance: '₹320' },
];

// ─── Logo badge ───────────────────────────────────────────────────────────────
function LogoBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: bg, color, fontSize: '8px', fontFamily: fonts.mono, fontWeight: 700,
      borderRadius: '4px', padding: '2px 5px', letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  );
}

// ─── Option tile (for bank grid / UPI grid) ───────────────────────────────────
function OptionTile({ label, color, bg, selected, onSelect }: {
  label: string; color: string; bg: string; selected: boolean; onSelect: () => void;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
        background: selected ? `${color}18` : RPZ.cardBg,
        border: `1.5px solid ${selected ? color : RPZ.border}`,
        borderRadius: '10px', cursor: 'pointer',
      }}
    >
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '9px', fontFamily: fonts.mono, fontWeight: 800, color,
        flexShrink: 0,
      }}>
        {label.slice(0, 3).toUpperCase()}
      </div>
      <span style={{ fontSize: '11px', fontFamily: fonts.body, fontWeight: 500, color: RPZ.textPrimary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {selected && <Check size={12} color={color} strokeWidth={3} />}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PaymentGatewayScreen() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const totalPrice: number = (location.state as any)?.totalPrice ?? 13290;

  const convenienceFee  = 100;
  const gst             = 0;
  const grandTotal      = totalPrice + convenienceFee + gst;

  const [expanded,      setExpanded]      = useState<MethodId | null>('netbanking');
  const [selBank,       setSelBank]       = useState('bob');
  const [selUpi,        setSelUpi]        = useState('gpay');
  const [selWallet,     setSelWallet]     = useState('paytmw');
  const [upiId,         setUpiId]         = useState('arjun@okhdfc');
  const [cardNum,       setCardNum]       = useState('');
  const [cardExpiry,    setCardExpiry]    = useState('');
  const [cardCvv,       setCardCvv]       = useState('');
  const [cardName,      setCardName]      = useState('');
  const [feeSheetOpen,  setFeeSheetOpen]  = useState(false);
  const [paying,        setPaying]        = useState(false);
  const [paid,          setPaid]          = useState(false);

  function toggleMethod(id: MethodId) {
    setExpanded(prev => prev === id ? null : id);
  }

  function handlePay() {
    setPaying(true);
    setFeeSheetOpen(false);
    setTimeout(() => {
      setPaid(true);
      setTimeout(() => navigate('/confirmed'), 1200);
    }, 1800);
  }

  return (
    <div style={{
      background: RPZ.bodyBg, flex: 1, display: 'flex', flexDirection: 'column',
      fontFamily: fonts.body, position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Razorpay-style header ── */}
      <div style={{
        background: RPZ.headerBg, padding: '12px 16px 14px',
        display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <ArrowLeft size={16} color="#fff" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
            TripMind
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
            {/* Razorpay shield */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5L12 2z" fill={RPZ.green} />
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '10px', fontFamily: fonts.mono, color: 'rgba(255,255,255,0.85)' }}>
              Razorpay Trusted Business
            </span>
          </div>
        </div>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <User size={16} color="#fff" />
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: '120px' }}>

        {/* ── Title ── */}
        <div style={{ padding: '18px 16px 10px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontFamily: fonts.heading, fontWeight: 800, color: RPZ.textPrimary }}>
            Payment Options
          </h2>
        </div>

        {/* ── Payment methods accordion ── */}
        <div style={{ padding: '0 16px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', fontFamily: fonts.body, color: RPZ.textSub }}>
            All Payment Options
          </p>

          <div style={{
            background: RPZ.cardBg, border: `1px solid ${RPZ.border}`,
            borderRadius: '14px', overflow: 'hidden',
          }}>
            {METHODS.map((m, i) => (
              <div key={m.id}>
                {/* Method row */}
                <motion.div
                  whileTap={{ background: '#F5F6FA' }}
                  onClick={() => toggleMethod(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', cursor: 'pointer',
                    background: expanded === m.id ? '#F0F4FF' : RPZ.cardBg,
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: expanded === m.id ? '#E3EAFF' : '#F5F6FA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', flexShrink: 0,
                  }}>
                    {m.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontFamily: fonts.body, fontWeight: 600, color: RPZ.textPrimary }}>
                      {m.label}
                    </span>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {m.logos.map(l => <LogoBadge key={l.label} {...l} />)}
                    </div>
                  </div>
                  {expanded === m.id
                    ? <ChevronUp size={16} color={RPZ.textMuted} />
                    : <ChevronRight size={16} color={RPZ.textMuted} />
                  }
                </motion.div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expanded === m.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden', borderTop: `1px solid ${RPZ.border}` }}
                    >
                      <div style={{ padding: '12px 14px 14px', background: '#FAFBFF' }}>

                        {/* CARDS */}
                        {m.id === 'cards' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                              { label: 'Card Number', value: cardNum, placeholder: '1234 5678 9012 3456', onChange: (v: string) => setCardNum(v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()) },
                              { label: 'Cardholder Name', value: cardName, placeholder: 'Name on card', onChange: setCardName },
                            ].map(f => (
                              <div key={f.label}>
                                <p style={{ margin: '0 0 5px', fontSize: '11px', fontFamily: fonts.mono, color: RPZ.textSub }}>{f.label}</p>
                                <input value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${RPZ.border}`, background: RPZ.cardBg, fontSize: '13px', fontFamily: fonts.mono, color: RPZ.textPrimary, outline: 'none', boxSizing: 'border-box' }} />
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 5px', fontSize: '11px', fontFamily: fonts.mono, color: RPZ.textSub }}>Expiry</p>
                                <input value={cardExpiry} onChange={e => { let v=e.target.value.replace(/\D/g,'').slice(0,4); if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2); setCardExpiry(v); }} placeholder="MM/YY"
                                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${RPZ.border}`, background: RPZ.cardBg, fontSize: '13px', fontFamily: fonts.mono, color: RPZ.textPrimary, outline: 'none', boxSizing: 'border-box' }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 5px', fontSize: '11px', fontFamily: fonts.mono, color: RPZ.textSub }}>CVV</p>
                                <input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="•••"
                                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${RPZ.border}`, background: RPZ.cardBg, fontSize: '13px', fontFamily: fonts.mono, color: RPZ.textPrimary, outline: 'none', boxSizing: 'border-box' }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* NETBANKING */}
                        {m.id === 'netbanking' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {BANKS.map(b => (
                              <OptionTile key={b.id} label={b.label} color={b.color} bg={b.bg}
                                selected={selBank === b.id} onSelect={() => setSelBank(b.id)} />
                            ))}
                          </div>
                        )}

                        {/* UPI */}
                        {m.id === 'upi' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              {UPI_APPS.map(u => (
                                <OptionTile key={u.id} label={u.label} color={u.color} bg={u.bg}
                                  selected={selUpi === u.id} onSelect={() => setSelUpi(u.id)} />
                              ))}
                            </div>
                            <p style={{ margin: '6px 0 4px', fontSize: '11px', fontFamily: fonts.mono, fontWeight: 700, color: RPZ.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or enter UPI ID</p>
                            <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@bankupi"
                              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${RPZ.border}`, background: RPZ.cardBg, fontSize: '13px', fontFamily: fonts.mono, color: RPZ.textPrimary, outline: 'none', boxSizing: 'border-box' }} />
                          </div>
                        )}

                        {/* WALLET */}
                        {m.id === 'wallet' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {WALLETS.map(w => (
                              <OptionTile key={w.id} label={w.label} color={w.color} bg={w.bg}
                                selected={selWallet === w.id} onSelect={() => setSelWallet(w.id)} />
                            ))}
                          </div>
                        )}

                        {/* PAY LATER */}
                        {m.id === 'paylater' && (
                          <p style={{ margin: 0, fontSize: '12px', fontFamily: fonts.mono, color: RPZ.textSub, lineHeight: 1.6 }}>
                            Pay later options will be shown after entering your mobile number at checkout.
                          </p>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {i < METHODS.length - 1 && <div style={{ height: '1px', background: RPZ.border }} />}
              </div>
            ))}
          </div>

          {/* Extra fees note */}
          <div style={{ marginTop: '14px', padding: '12px 14px', background: RPZ.cardBg, border: `1px solid ${RPZ.border}`, borderRadius: '12px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '12px', fontFamily: fonts.heading, fontWeight: 700, color: RPZ.textPrimary }}>Extra Fees Added</p>
            <p style={{ margin: 0, fontSize: '11px', fontFamily: fonts.body, color: RPZ.textSub, lineHeight: 1.6 }}>
              A convenience fee will be charged depending on your choice of payment method.
            </p>
          </div>
        </div>

      </div>

      {/* ── Fixed bottom bar ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: RPZ.cardBg, borderTop: `1px solid ${RPZ.border}`,
        padding: '12px 16px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Amount + View Details */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontFamily: fonts.heading, fontWeight: 800, color: RPZ.textPrimary }}>
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: RPZ.textSub }}>+ Fee</span>
            </div>
            <motion.button
              whileTap={{ opacity: 0.7 }}
              onClick={() => setFeeSheetOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}
            >
              <span style={{ fontSize: '11px', fontFamily: fonts.mono, color: RPZ.headerBg, fontWeight: 600 }}>View Details</span>
              <ChevronUp size={11} color={RPZ.headerBg} />
            </motion.button>
          </div>

          {/* Continue & Pay */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePay}
            disabled={paying || paid}
            style={{
              flex: 1.2, padding: '14px 10px', borderRadius: '12px', border: 'none',
              background: paying || paid ? '#555' : RPZ.black,
              cursor: paying || paid ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            <AnimatePresence mode="wait">
              {paid ? (
                <motion.div key="paid" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#fff" strokeWidth={3} />
                  <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>Paid!</span>
                </motion.div>
              ) : paying ? (
                <motion.div key="paying" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff' }} />
                  <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>Processing…</span>
                </motion.div>
              ) : (
                <motion.div key="idle" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={13} color="#fff" />
                  <span style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>Continue & Pay</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Fee Breakup Bottom Sheet ── */}
      <AnimatePresence>
        {feeSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFeeSheetOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 70 }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 71,
                background: RPZ.cardBg, borderRadius: '20px 20px 0 0',
                padding: '20px 20px 32px',
              }}
            >
              {/* Sheet header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: RPZ.textPrimary }}>Fee Breakup</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setFeeSheetOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: RPZ.bodyBg } as any}>
                  <X size={14} color={RPZ.textSub} />
                </motion.button>
              </div>

              {/* Rows */}
              {[
                { label: 'Amount',                    amount: totalPrice,      bold: false },
                { label: 'Convenience Charges',       amount: convenienceFee,  bold: false },
                { label: 'GST on Convenience Charges',amount: gst,             bold: false },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', marginBottom: '14px', borderBottom: `1px solid ${RPZ.border}` }}>
                  <span style={{ fontSize: '13px', fontFamily: fonts.body, color: RPZ.textSub }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontFamily: fonts.mono, color: RPZ.textPrimary }}>₹{row.amount.toLocaleString('en-IN')}.00</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: RPZ.textPrimary }}>Total Charges</span>
                <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 800, color: RPZ.textPrimary }}>₹{grandTotal.toLocaleString('en-IN')}.00</span>
              </div>

              {/* Continue & Pay */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePay}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: RPZ.black, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Lock size={14} color="#fff" />
                <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#fff' }}>
                  Continue & Pay
                </span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
