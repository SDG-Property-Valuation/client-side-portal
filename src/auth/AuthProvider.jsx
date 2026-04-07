import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import apiClient from "../api/apiClient.js";
import { API_ENDPOINTS } from "../api/endpoints.js";
import { normalizeAuthRole, sanitizeAuthUser } from "./authUtils.js";

const AUTH_STORAGE_KEY = "valuation-portal-auth";
const AUTH_FAILURE_STATUS_CODES = new Set([401, 403]);
const AUTH_API_BY_ROLE = {
  client: API_ENDPOINTS.client.auth,
  banker: API_ENDPOINTS.bank.auth,
};

const inferAuthRoleFromUrl = (url) => {
  const normalizedUrl = String(url ?? "");

  if (normalizedUrl.includes("/api/v1/client/")) {
    return "client";
  }

  if (normalizedUrl.includes("/api/v1/bank/")) {
    return "banker";
  }

  return null;
};

const shouldSkipAuthRetry = (config) => {
  if (config?.skipAuthRefresh) {
    return true;
  }

  const normalizedUrl = String(config?.url ?? "");

  return [
    "/client-login",
    "/banker-login",
    "/refresh-auth",
    "/me",
    "/client-logout",
    "/banker-logout",
  ].some((pathSegment) => normalizedUrl.includes(pathSegment));
};

const createDefaultAuthState = () => ({
  isAuthenticated: false,
  user: null,
  authRole: null,
});

const AuthContext = createContext({
  isAuthenticated: false,
  isAuthLoading: true,
  user: null,
  authRole: null,
  login: async () => false,
  logout: async () => false,
  revalidateSession: async () => false,
});

const getStoredAuthState = () => {
  if (typeof window === "undefined") {
    return createDefaultAuthState();
  }

  try {
    const storedAuthState = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuthState) {
      return createDefaultAuthState();
    }

    const parsedAuthState = JSON.parse(storedAuthState);
    const authRole = normalizeAuthRole(
      parsedAuthState?.authRole ?? parsedAuthState?.user?.role,
    );

    if (!authRole) {
      return createDefaultAuthState();
    }

    return {
      isAuthenticated: false,
      user: sanitizeAuthUser(parsedAuthState?.user, authRole),
      authRole,
    };
  } catch {
    return createDefaultAuthState();
  }
};

const getAuthRoleCandidates = (...candidates) => {
  const normalizedRoles = [];

  for (const candidate of [...candidates, ...Object.keys(AUTH_API_BY_ROLE)]) {
    const normalizedRole = normalizeAuthRole(candidate);

    if (
      normalizedRole &&
      AUTH_API_BY_ROLE[normalizedRole] &&
      !normalizedRoles.includes(normalizedRole)
    ) {
      normalizedRoles.push(normalizedRole);
    }
  }

  return normalizedRoles;
};

const persistAuthState = ({ authRole, user, isAuthenticated }) => {
  if (typeof window === "undefined") {
    return;
  }

  if (isAuthenticated && authRole) {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        authRole,
        user,
      }),
    );
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getStoredAuthState);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const authStateRef = useRef(authState);
  const revalidationPromiseRef = useRef(null);
  const refreshPromiseRef = useRef(null);

  useEffect(() => {
    authStateRef.current = authState;
  }, [authState]);

  const applyAuthState = useCallback((nextAuthState) => {
    authStateRef.current = nextAuthState;
    setAuthState(nextAuthState);
    persistAuthState(nextAuthState);
  }, []);

  const setAuthenticatedSession = useCallback(
    (role, sessionUser) => {
      const normalizedRole = normalizeAuthRole(role);

      if (!normalizedRole) {
        return;
      }

      applyAuthState({
        isAuthenticated: true,
        user: sanitizeAuthUser(sessionUser, normalizedRole),
        authRole: normalizedRole,
      });
    },
    [applyAuthState],
  );

  const clearAuthenticatedSession = useCallback(() => {
    applyAuthState(createDefaultAuthState());
  }, [applyAuthState]);

  const isAuthFailure = useCallback(
    (error) => AUTH_FAILURE_STATUS_CODES.has(error?.response?.status),
    [],
  );

  const getRoleSessionProfile = useCallback(async (role) => {
    const sessionUrl = AUTH_API_BY_ROLE[role]?.session;

    if (!sessionUrl) {
      return null;
    }

    const response = await apiClient.get(sessionUrl, { withCredentials: true });
    const apiResponse = response?.data ?? {};

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || "Unable to fetch current session");
    }

    return apiResponse.data;
  }, []);

  const refreshRoleAuth = useCallback(async (role) => {
    const refreshUrl = AUTH_API_BY_ROLE[role]?.refresh;

    if (!refreshUrl) {
      return null;
    }

    const response = await apiClient.post(
      refreshUrl,
      {},
      { withCredentials: true },
    );
    const apiResponse = response?.data ?? {};

    if (!apiResponse.success) {
      throw new Error(
        apiResponse.message || "Unable to refresh authentication",
      );
    }

    return apiResponse.data;
  }, []);

  const refreshSessionToken = useCallback(
    async (preferredRole = null) => {
      const normalizedRole =
        normalizeAuthRole(preferredRole) ||
        normalizeAuthRole(authStateRef.current.authRole) ||
        "client";

      if (!AUTH_API_BY_ROLE[normalizedRole]?.refresh) {
        throw new Error("Unable to refresh authentication");
      }

      if (refreshPromiseRef.current) {
        return refreshPromiseRef.current;
      }

      const refreshPromise = refreshRoleAuth(normalizedRole);
      refreshPromiseRef.current = refreshPromise;

      try {
        return await refreshPromise;
      } finally {
        if (refreshPromiseRef.current === refreshPromise) {
          refreshPromiseRef.current = null;
        }
      }
    },
    [refreshRoleAuth],
  );

  const revalidateSession = useCallback(
    async (preferredRole = null) => {
      const roleCandidates = getAuthRoleCandidates(
        preferredRole,
        authStateRef.current.authRole,
      );

      if (!roleCandidates.length) {
        clearAuthenticatedSession();
        return false;
      }

      if (revalidationPromiseRef.current) {
        return revalidationPromiseRef.current;
      }

      const revalidationPromise = (async () => {
        for (const normalizedRole of roleCandidates) {
          try {
            const sessionUser = await getRoleSessionProfile(normalizedRole);
            setAuthenticatedSession(normalizedRole, sessionUser);
            return true;
          } catch (sessionError) {
            if (!isAuthFailure(sessionError)) {
              return authStateRef.current.isAuthenticated;
            }

            try {
              await refreshSessionToken(normalizedRole);
              const sessionUser = await getRoleSessionProfile(normalizedRole);
              setAuthenticatedSession(normalizedRole, sessionUser);
              return true;
            } catch (refreshError) {
              if (!isAuthFailure(refreshError)) {
                return authStateRef.current.isAuthenticated;
              }
            }
          }
        }

        clearAuthenticatedSession();
        return false;
      })();

      revalidationPromiseRef.current = revalidationPromise;

      try {
        return await revalidationPromise;
      } finally {
        if (revalidationPromiseRef.current === revalidationPromise) {
          revalidationPromiseRef.current = null;
        }
      }
    },
    [
      clearAuthenticatedSession,
      getRoleSessionProfile,
      isAuthFailure,
      refreshSessionToken,
      setAuthenticatedSession,
    ],
  );

  useEffect(() => {
    const responseInterceptorId = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;

        if (
          !originalRequest ||
          !isAuthFailure(error) ||
          shouldSkipAuthRetry(originalRequest) ||
          originalRequest._retryAuthRefresh
        ) {
          return Promise.reject(error);
        }

        const requestRole =
          normalizeAuthRole(originalRequest.authRole) ||
          inferAuthRoleFromUrl(originalRequest.url) ||
          normalizeAuthRole(authStateRef.current.authRole);

        if (!requestRole || !AUTH_API_BY_ROLE[requestRole]?.refresh) {
          clearAuthenticatedSession();
          return Promise.reject(error);
        }

        originalRequest._retryAuthRefresh = true;

        try {
          await refreshSessionToken(requestRole);
          return apiClient(originalRequest);
        } catch (refreshError) {
          clearAuthenticatedSession();
          return Promise.reject(refreshError);
        }
      },
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptorId);
    };
  }, [clearAuthenticatedSession, isAuthFailure, refreshSessionToken]);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const hasStoredSessionHint = Boolean(
        authStateRef.current.authRole || authStateRef.current.user,
      );

      if (!hasStoredSessionHint) {
        if (isMounted) {
          setIsAuthLoading(false);
        }
        return;
      }

      try {
        await revalidateSession();
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [revalidateSession]);

  const login = useCallback(
    async (role, sessionUser = null) => {
      const normalizedRole = normalizeAuthRole(role);

      if (!normalizedRole) {
        return false;
      }

      setAuthenticatedSession(normalizedRole, sessionUser);
      return true;
    },
    [setAuthenticatedSession],
  );

  const logout = useCallback(async () => {
    const normalizedRole = normalizeAuthRole(authStateRef.current.authRole);
    const logoutUrl = AUTH_API_BY_ROLE[normalizedRole]?.logout;

    try {
      if (logoutUrl) {
        await apiClient.post(logoutUrl, {}, { withCredentials: true });
      }
    } catch {
      // Local auth state should still be cleared even if the logout request fails.
    } finally {
      clearAuthenticatedSession();
    }

    return true;
  }, [clearAuthenticatedSession]);

  const value = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      isAuthLoading,
      user: authState.user,
      authRole: authState.authRole,
      login,
      logout,
      revalidateSession,
    }),
    [authState, isAuthLoading, login, logout, revalidateSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
