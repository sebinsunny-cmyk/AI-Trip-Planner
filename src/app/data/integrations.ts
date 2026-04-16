import uberLogo from '../../assets/logos/uber-logo.webp';
import olaLogo from '../../assets/logos/white_ola_logo.png';
import makemtLogo from '../../assets/logos/makemt.png';

export type OAuthStyle = 'google' | 'uber' | 'ola' | 'mmt';

export interface IntegrationService {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  brand: {
    color: string;       // primary brand color
    headerBg: string;    // OAuth screen header background
    textOnBrand: string; // text/icon color on brand bg
    iconBg: string;      // icon container bg in settings card
  };
  logo: string | null;
  logoUrl?: string;
  logoFilter?: string;   // CSS filter applied to logo img in settings card
  logoWordmark?: { text: string; color: string; fontSize: string; fontWeight: number; letterSpacing?: string }; // text wordmark fallback
  permissions: string[];
  capabilities: { icon: string; text: string }[];
  oauthStyle: OAuthStyle;
  mockAccount: string;
}

export const INTEGRATION_SERVICES: IntegrationService[] = [
  {
    id: 'mmt',
    name: 'MakeMyTrip',
    tagline: 'India\'s largest travel platform',
    description: 'Search & booking',
    category: 'Flights & Hotels',
    brand: {
      color: '#E8203D',
      headerBg: '#E8203D',
      textOnBrand: '#ffffff',
      iconBg: '#fff',           // white bg so colour logo shows naturally
    },
    logo: makemtLogo,
    logoFilter: 'none',
    permissions: [
      'Search flights on your behalf',
      'Book tickets using your saved preferences',
      'View upcoming booking status',
      'Access booking history for expense tracking',
    ],
    capabilities: [
      { icon: '✈️', text: 'Search & compare flights automatically' },
      { icon: '🏨', text: 'Find and book hotels matching your preferences' },
      { icon: '📋', text: 'Sync booking confirmations to your trip timeline' },
    ],
    oauthStyle: 'mmt',
    mockAccount: 'sebin.sunny@gadgeon.com',
  },
  {
    id: 'uber',
    name: 'Uber for Business',
    tagline: 'Rides made for work',
    description: 'Ride tracking',
    category: 'Cab',
    brand: {
      color: '#000000',
      headerBg: '#000000',
      textOnBrand: '#ffffff',
      iconBg: '#000000',        // black bg, logo is light with alpha
    },
    logo: null,
    logoWordmark: { text: 'Uber', color: '#ffffff', fontSize: '15px', fontWeight: 900, letterSpacing: '-0.5px' },
    permissions: [
      'Request rides on your behalf',
      'Access ride history for expense reports',
      'Set pickup location from your trip itinerary',
      'Apply corporate billing automatically',
    ],
    capabilities: [
      { icon: '🚗', text: 'Auto-book airport pickups and drops' },
      { icon: '💼', text: 'Apply corporate account for seamless billing' },
      { icon: '📍', text: 'Pre-fill pickup from your flight arrival details' },
    ],
    oauthStyle: 'uber',
    mockAccount: 'sebin.sunny@gadgeon.com',
  },
  {
    id: 'ola',
    name: 'Ola Corporate',
    tagline: 'Smart rides for your team',
    description: 'Cab bookings',
    category: 'Cab',
    brand: {
      color: '#2AC05A',
      headerBg: '#1A9E49',
      textOnBrand: '#ffffff',
      iconBg: '#1A9E49',        // green bg, logo is already white
    },
    logo: olaLogo,
    logoFilter: 'none',         // white_ola_logo.png is already white — no filter needed
    permissions: [
      'Request Ola rides on your behalf',
      'Access ride history',
      'Manage corporate wallet usage',
      'Enable auto-billing to your company account',
    ],
    capabilities: [
      { icon: '🚖', text: 'Book Ola rides as a cab fallback automatically' },
      { icon: '🏢', text: 'Charge rides to your corporate Ola account' },
      { icon: '📊', text: 'Sync ride costs to your expense report' },
    ],
    oauthStyle: 'ola',
    mockAccount: 'sebin.sunny@gadgeon.com',
  },
  {
    id: 'gcal',
    name: 'Google Calendar',
    tagline: 'Keep your schedule in sync',
    description: 'Trips to calendar',
    category: 'Productivity',
    brand: {
      color: '#4285F4',
      headerBg: '#ffffff',
      textOnBrand: '#ffffff',
      iconBg: '#ffffff',
    },
    logo: null,
    logoUrl: 'https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_2_2x.png',
    permissions: [
      'Create calendar events for your trips',
      'Read your calendar to avoid scheduling conflicts',
      'Update events when trip details change',
    ],
    capabilities: [
      { icon: '📅', text: 'Auto-create trip events with flight & hotel details' },
      { icon: '🔔', text: 'Add check-in reminders and departure alerts' },
      { icon: '🔄', text: 'Keep events updated when bookings change' },
    ],
    oauthStyle: 'google',
    mockAccount: 'sebin.sunny@gadgeon.com',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    tagline: 'Your inbox, connected to your trips',
    description: 'Your inbox',
    category: 'Productivity',
    brand: {
      color: '#EA4335',
      headerBg: '#ffffff',
      textOnBrand: '#ffffff',
      iconBg: '#ffffff',
    },
    logo: null,
    logoUrl: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png',
    permissions: [
      'Read booking confirmation emails',
      'Extract e-ticket details automatically',
      'Detect travel-related emails only',
    ],
    capabilities: [
      { icon: '📧', text: 'Detect booking confirmations and import to your trips' },
      { icon: '🎫', text: 'Extract e-tickets and boarding passes automatically' },
      { icon: '🔍', text: 'Parse hotel & flight details from confirmation emails' },
    ],
    oauthStyle: 'google',
    mockAccount: 'sebin.sunny@gadgeon.com',
  },
];

// ─── localStorage helpers ────────────────────────────────────────────────────

const STORAGE_KEY = 'tripmind-integrations';

export function getConnectedIntegrations(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function setIntegrationConnected(id: string, connected: boolean): void {
  const current = getConnectedIntegrations();
  if (connected) {
    current[id] = true;
  } else {
    delete current[id];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function isIntegrationConnected(id: string): boolean {
  return getConnectedIntegrations()[id] === true;
}
