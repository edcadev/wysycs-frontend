import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Base URL del API centralizada
 */
export const API_BASE_URL = 'https://web-production-7dae.up.railway.app/api/v1';

/**
 * Instancia de axios configurada con interceptores
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para requests - Permite agregar headers, auth, etc.
 */
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens de autenticación si es necesario
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para responses - Manejo centralizado de errores
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo global de errores
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      console.error('Error del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request fue hecho pero no hubo respuesta
      console.error('Sin respuesta del servidor:', error.request);
    } else {
      // Error en la configuración del request
      console.error('Error en la petición:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * API Functions - Funciones helper para peticiones HTTP
 */

// ========== FORESTS ==========
export const forestsApi = {
  /**
   * Obtener todos los bosques
   */
  getAll: async () => {
    const response = await api.get('/forests');
    return response.data;
  },

  /**
   * Obtener un bosque por ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/forests/${id}`);
    return response.data;
  },
};

// ========== FIRES ==========
export const firesApi = {
  /**
   * Obtener incendios en Perú
   * @param days - Número de días a consultar (default: 2)
   */
  getPeruFires: async (days: number = 2) => {
    const response = await api.get('/fires/peru', {
      params: { days },
    });
    return response.data;
  },

  /**
   * Analizar riesgo de incendio en coordenadas específicas
   */
  analyzeRisk: async (params: {
    lat: number;
    lon: number;
    radius_km?: number;
    days?: number;
  }) => {
    const response = await api.get('/fires/analyze', {
      params: {
        lat: params.lat,
        lon: params.lon,
        radius_km: params.radius_km || 20,
        days: params.days || 2,
      },
    });
    return response.data;
  },
};

// ========== GUARDIAN ==========
export const guardianApi = {
  /**
   * Obtener información de un guardián por email
   */
  getByEmail: async (email: string) => {
    const response = await api.get(`/guardian/${encodeURIComponent(email)}`);
    return response.data;
  },
};

// ========== ADOPTION ==========
export const adoptionApi = {
  /**
   * Adoptar un bosque
   */
  adoptForest: async (data: {
    forest_id: string;
    guardian_name: string;
    guardian_email: string;
    telegram_chat_id?: string | null;
  }) => {
    const response = await api.post('/adopt', data);
    return response.data;
  },
};

/**
 * Export default de la instancia configurada de axios
 * Para casos de uso personalizados
 */
export default api;
