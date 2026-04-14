import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, ChevronRight, Wifi, Coffee, Car } from 'lucide-react';
import { tm, fonts } from '../constants/colors';

export interface HotelOption {
  id: string;
  name: string;
  stars: number;
  distanceFromVenue: string;
  pricePerNight: number;
  rating: string;
  ratingCount: string;
  amenities: string[];
  recommended?: boolean;
  reasoning?: string;
  image?: string;
}

interface HotelOptionCardProps {
  hotels: HotelOption[];
  onSelect: (hotel: HotelOption) => void;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  Wifi:    <Wifi size={10} />,
  Parking: <Car size={10} />,
  Breakfast: <Coffee size={10} />,
};

export function HotelOptionCard({ hotels, onSelect }: HotelOptionCardProps) {
  const [selected, setSelected] = useState<string>(
    hotels.find(h => h.recommended)?.id ?? hotels[0]?.id
  );

  const selectedHotel = hotels.find(h => h.id === selected)!;

  return (
    <div>
      <p style={{ fontSize: '11px', color: tm.textSecondary, fontFamily: fonts.mono, margin: '0 0 10px' }}>
        Showing hotels near your meeting venue · Apr 15
      </p>

      {hotels.map((hotel, index) => {
        const isSelected = selected === hotel.id;
        return (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, type: 'spring', stiffness: 280, damping: 28 }}
            onClick={() => setSelected(hotel.id)}
            style={{
              background: tm.bgSurface,
              border: `1px solid ${isSelected ? `${tm.accentAmber}60` : tm.borderSubtle}`,
              borderLeft: `3px solid ${isSelected ? tm.accentAmber : tm.borderSubtle}`,
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '10px',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
          >
            {/* Hotel banner */}
            <div style={{ position: 'relative', height: '90px', overflow: 'hidden' }}>
              {hotel.image ? (
                <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: hotel.stars >= 5
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)'
                    : hotel.stars >= 4
                    ? 'linear-gradient(135deg, #2d1b4e 0%, #4a2c6e 50%, #6b3fa0 100%)'
                    : 'linear-gradient(135deg, #1a3a2e 0%, #1e4d3a 50%, #2d6a4f 100%)',
                }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
              {hotel.recommended && (
                <span style={{
                  position: 'absolute', top: '8px', right: '8px',
                  fontSize: '9px', fontFamily: fonts.mono, fontWeight: 700,
                  color: '#ffffff', background: tm.accentAmber,
                  borderRadius: '4px', padding: '2px 6px', letterSpacing: '0.04em',
                }}>
                  BEST FIT
                </span>
              )}
            </div>

            {/* Card body */}
            <div style={{ padding: '14px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  {false && (
                    <span style={{
                      fontSize: '9px', fontFamily: fonts.mono, fontWeight: 700,
                      color: '#ffffff', background: tm.accentAmber,
                      borderRadius: '4px', padding: '2px 6px', letterSpacing: '0.04em',
                    }}>
                      BEST FIT
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} size={9} color={tm.accentAmber} fill={tm.accentAmber} />
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontFamily: fonts.heading, fontWeight: 700, color: tm.textPrimary }}>
                  {hotel.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <MapPin size={10} color={tm.textSecondary} />
                  <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                    {hotel.distanceFromVenue} from venue
                  </span>
                </div>
              </div>

              {/* Price + rating */}
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '10px' }}>
                <div style={{ fontSize: '16px', fontFamily: fonts.heading, fontWeight: 800, color: tm.textPrimary }}>
                  ₹{hotel.pricePerNight.toLocaleString()}
                </div>
                <div style={{ fontSize: '9px', color: tm.textSecondary, fontFamily: fonts.mono }}>per night</div>
                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                  <Star size={9} color={tm.accentTeal} fill={tm.accentTeal} />
                  <span style={{ fontSize: '10px', color: tm.accentTeal, fontFamily: fonts.mono, fontWeight: 600 }}>
                    {hotel.rating}
                  </span>
                  <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>
                    ({hotel.ratingCount})
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {hotel.amenities.map(a => (
                <div key={a} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: tm.bgElevated, borderRadius: '6px', padding: '3px 7px',
                }}>
                  <span style={{ color: tm.textSecondary }}>{AMENITY_ICONS[a] ?? null}</span>
                  <span style={{ fontSize: '10px', color: tm.textSecondary, fontFamily: fonts.mono }}>{a}</span>
                </div>
              ))}
            </div>

            {/* Reasoning — only on selected recommended */}
            {isSelected && hotel.reasoning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  marginTop: '10px', padding: '8px 10px',
                  background: `${tm.accentAmber}10`,
                  border: `1px solid ${tm.accentAmber}25`,
                  borderRadius: '8px',
                }}
              >
                <p style={{ fontSize: '11px', color: tm.textNarration, fontFamily: fonts.body, margin: 0, lineHeight: 1.5 }}>
                  💡 {hotel.reasoning}
                </p>
              </motion.div>
            )}
            </div>{/* end card body */}
          </motion.div>
        );
      })}

      {/* Confirm button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => onSelect(selectedHotel)}
        style={{
          width: '100%',
          background: tm.accentAmber,
          border: 'none',
          borderRadius: '12px',
          padding: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '14px', fontFamily: fonts.heading, fontWeight: 700, color: '#ffffff' }}>
          Book {selectedHotel?.name.split(' ').slice(0, 2).join(' ')}
        </span>
        <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
      </motion.button>

      <button
        style={{
          width: '100%',
          background: 'transparent',
          border: `1px solid ${tm.borderSubtle}`,
          borderRadius: '12px',
          padding: '12px',
          cursor: 'pointer',
          fontSize: '13px',
          color: tm.textSecondary,
          fontFamily: fonts.body,
        }}
      >
        Skip — no hotel needed
      </button>
    </div>
  );
}
