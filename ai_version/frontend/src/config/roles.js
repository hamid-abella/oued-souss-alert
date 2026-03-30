export const PERMISSIONS = {
  zones:        { admin: ['read','create','update','delete'], operator: ['read'],          reader: ['read'], security: ['read'] },
  sensors:      { admin: ['read','create','update','delete'], operator: ['read','update'], reader: ['read'], security: ['read'] },
  measurements: { admin: ['read','create','delete'],          operator: ['read','create'], reader: ['read'], security: ['read'] },
  alerts:       { admin: ['read','create','update','delete'], operator: ['read','update'], reader: ['read'], security: ['read','update'] },
  risk:         { admin: ['read','create'],                   operator: ['read','create'], reader: ['read'], security: ['read'] },
  dashboard:    { admin: ['read'], operator: ['read'], reader: ['read'], security: ['read'] },
  users:        { admin: ['read','create','update','delete'], operator: [],               reader: [],       security: ['read'] },
  admin:        { admin: ['create'], operator: [], reader: [], security: [] },
};