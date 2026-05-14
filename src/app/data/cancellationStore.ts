// ─── Cancellation & Refund Lifecycle Store ──────────────────────────────────
// In-memory only — intentionally resets on page refresh so the demo can be
// repeated without clearing state manually.

export type RefundStatus = 'initiated' | 'processing' | 'credited';

export interface RefundBreakdownItem {
  label: string;
  amount: number;
  refundable: boolean;
  category: 'flight' | 'hotel' | 'cab';
}

export interface CancelledTripRecord {
  tripId: string;
  cancelledAt: string;   // ISO datetime string
  reason: string;
  refundBreakdown: RefundBreakdownItem[];
  totalRefund: number;
  totalPaid: number;
  refundTo: string;      // e.g. "Visa ••4211"
  refundStatus: RefundStatus;
}

// Module-level store — lives for the duration of the browser session only
const store: Record<string, CancelledTripRecord> = {};

export function getCancellations(): Record<string, CancelledTripRecord> {
  return store;
}

export function getCancellation(tripId: string): CancelledTripRecord | null {
  return store[tripId] ?? null;
}

export function saveCancellation(record: CancelledTripRecord): void {
  store[record.tripId] = record;
}

export function updateRefundStatus(tripId: string, status: RefundStatus): void {
  const record = store[tripId];
  if (!record) return;
  store[tripId] = { ...record, refundStatus: status };
}

export function isTripCancelled(tripId: string): boolean {
  return tripId in store;
}

/**
 * Derives a refund breakdown from a trip's expense list.
 * Policy: flights are non-refundable, hotel + cabs are fully refundable.
 */
export function buildRefundBreakdown(
  expenses: Array<{ label: string; amount: number; category: 'flight' | 'cab' | 'hotel' | 'other' }>,
): RefundBreakdownItem[] {
  return expenses
    .filter(e => e.category !== 'other')
    .map(e => ({
      label: e.label,
      amount: e.amount,
      refundable: e.category !== 'flight',
      category: e.category as 'flight' | 'hotel' | 'cab',
    }));
}
