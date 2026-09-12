/**
 * Utility constants used across the app.
 */

export const VEHICLE_TYPES = ['Car', 'Bike', 'EV'];

export const SLOT_STATUS = {
  available: { label: 'Available', color: '#22c55e', bg: '#dcfce7' },
  occupied: { label: 'Occupied', color: '#ef4444', bg: '#fee2e2' },
  maintenance: { label: 'Maintenance', color: '#6b7280', bg: '#f3f4f6' },
};

export const BOOKING_STATUS = {
  confirmed: { label: 'Confirmed', color: '#22c55e', bg: '#dcfce7' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
  completed: { label: 'Completed', color: '#3b82f6', bg: '#dbeafe' },
};

export const PAYMENT_METHODS = ['UPI', 'Card', 'Cash'];

export const VEHICLE_ICONS = {
  Car: '🚗',
  Bike: '🏍️',
  EV: '⚡',
};
