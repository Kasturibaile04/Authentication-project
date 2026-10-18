import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Centralized axios instance
const apiClient = axios.create({
    baseURL: `${BASE_URL}/api/auth`,
    withCredentials: true, // sends the refreshToken cookie automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Helper: attach access token from memory ───────────────────────────────
let _accessToken = null;

export function setAccessToken(token) {
    _accessToken = token;
}

export function getAccessToken() {
    return _accessToken;
}

export function clearAccessToken() {
    _accessToken = null;
}

// Attach Bearer token to every request if available
apiClient.interceptors.request.use((config) => {
    if (_accessToken) {
        config.headers['Authorization'] = `Bearer ${_accessToken}`;
    }
    return config;
});

// ─── Auth API calls ───────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { username, email, password }
 * Returns: { message, user: { username, email }, accessToken }
 */
export async function register({ username, email, password }) {
    const { data } = await apiClient.post('/register', { username, email, password });
    return data;
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { message, user: { username, email }, accessToken }
 */
export async function login({ email, password }) {
    const { data } = await apiClient.post('/login', { email, password });
    return data;
}

/**
 * GET /api/auth/get-me
 * Requires Authorization header (set via interceptor)
 * Returns: { message, user: { username, email } }
 */
export async function getMe() {
    const { data } = await apiClient.get('/get-me');
    return data;
}

/**
 * GET /api/auth/refresh-token
 * Uses the refreshToken cookie (withCredentials)
 * Returns: { message, accessToken }
 */
export async function refreshAccessToken() {
    const { data } = await apiClient.get('/refresh-token');
    return data;
}

/**
 * POST /api/auth/logout
 * Uses the refreshToken cookie (withCredentials) to revoke session
 * Returns: { message }
 */
export async function logout() {
    const { data } = await apiClient.post('/logout');
    return data;
}

export default apiClient;
