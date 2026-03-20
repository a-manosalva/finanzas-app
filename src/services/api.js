const BASE_URL = 'https://finanzas-api.ubunifusoft.digital';

/**
 * Executes a fetch request to the Finanzas API with the appropriate headers.
 * 
 * @param {string} endpoint - The endpoint to call (e.g., '/api/auth/login').
 * @param {object} options - Fetch options.
 * @returns {Promise<any>} The parsed JSON data.
 * @throws {Error} if the request fails or API returns an error status.
 */
export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || (data.status && data.status >= 400)) {
       throw new Error(data.mensaje || data.message || 'Error executing request');
    }

    // The API wraps successful responses in a `data` property most of the time
    // If structured as `status` and `data` and `mensaje`, unwrap it:
    return data.status && data.data !== undefined ? data.data : data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please try again.');
    }
    throw error;
  }
};
