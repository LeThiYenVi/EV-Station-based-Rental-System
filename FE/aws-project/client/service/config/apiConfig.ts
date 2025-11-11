// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '', // Empty string để dùng proxy
  API_PREFIX: '/api',
  TIMEOUT: 30000, // 30 seconds
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    CONFIRM: '/auth/confirm',
    GOOGLE_CALLBACK: '/auth/callback',
    GOOGLE_URL: '/auth/url',
  },
  BOOKINGS: {
    CREATE: '/bookings',
    GET_ALL: '/bookings',
    GET_BY_ID: '/bookings/:id',
    GET_BY_CODE: '/bookings/code/:code',
    GET_MY_BOOKINGS: '/bookings/my-bookings',
    GET_BY_STATUS: '/bookings/status/:status',
    GET_BY_VEHICLE: '/bookings/vehicle/:vehicleId',
    GET_BY_STATION: '/bookings/station/:stationId',
    UPDATE: '/bookings/:id',
    CONFIRM: '/bookings/:id/confirm',
    START: '/bookings/:id/start',
    COMPLETE: '/bookings/:id/complete',
    CANCEL: '/bookings/:id/cancel',
    DELETE: '/bookings/:id',
  },
  FLEET: {
    VEHICLES_AT_STATION: '/admin/fleet/stations/:stationId/vehicles',
    STATUS_SUMMARY: '/admin/fleet/stations/:stationId/summary',
    VEHICLE_HISTORY: '/admin/fleet/vehicles/:vehicleId/history',
    DISPATCHABLE_VEHICLES: '/admin/fleet/stations/:stationId/dispatchable',
  },
  PAYMENTS: {
    MOMO_CALLBACK: '/payments/momo/callback',
    GET_BY_ID: '/payments/:paymentId',
    GET_BY_BOOKING: '/payments/booking/:bookingId',
    GET_BY_TRANSACTION: '/payments/transaction/:transactionId',
  },
  REPORTS: {
    REVENUE_BY_STATION: '/admin/reports/revenue-by-station',
    UTILIZATION: '/admin/reports/utilization',
    PEAK_HOURS: '/admin/reports/peak-hours',
    STAFF_PERFORMANCE: '/admin/reports/staff-performance',
    CUSTOMER_RISK: '/admin/reports/customer-risk',
  },
  STAFF: {
    GET_BY_STATION: '/admin/staff',
  },
  STATIONS: {
    CREATE: '/stations',
    UPDATE: '/stations/:stationId',
    GET_BY_ID: '/stations/:stationId',
    GET_ALL: '/stations',
    GET_ACTIVE: '/stations/active',
    GET_BY_STATUS: '/stations/status/:status',
    DELETE: '/stations/:stationId',
    CHANGE_STATUS: '/stations/:stationId/status',
    AVAILABLE_VEHICLES_COUNT: '/stations/:stationId/vehicles/available/count',
    UPLOAD_PHOTO: '/stations/:stationId/photo',
  },
  USERS: {
    GET_ME: '/users/me',
    GET_ALL: '/users',
    GET_BY_ID: '/users/:userId',
    GET_BY_ROLE: '/users/role/:role',
    UPDATE: '/users/:userId',
    UPDATE_ROLE: '/users/:userId/role',
    VERIFY_LICENSE: '/users/:userId/verify-license',
    UPLOAD_AVATAR: '/users/:userId/avatar',
    UPLOAD_LICENSE_CARD: '/users/:userId/license-card',
    DELETE: '/users/:userId',
  },
  VEHICLES: {
    CREATE: '/vehicles',
    UPDATE: '/vehicles/:vehicleId',
    GET_BY_ID: '/vehicles/:vehicleId',
    GET_ALL: '/vehicles',
    GET_BY_STATION: '/vehicles/station/:stationId',
    GET_AVAILABLE: '/vehicles/available',
    GET_AVAILABLE_FOR_BOOKING: '/vehicles/available/booking',
    GET_BY_STATUS: '/vehicles/status/:status',
    GET_BY_BRAND: '/vehicles/brand/:brand',
    DELETE: '/vehicles/:vehicleId',
    CHANGE_STATUS: '/vehicles/:vehicleId/status',
    INCREMENT_RENT_COUNT: '/vehicles/:vehicleId/rent-count',
    UPLOAD_PHOTOS: '/vehicles/:vehicleId/photos',
  },
};

export const getFullUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};
