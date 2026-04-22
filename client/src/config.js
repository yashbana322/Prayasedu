/* 
  Configuration for API calls. 
  Uses VITE_API_URL if defined, otherwise defaults to local development server.
*/
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
