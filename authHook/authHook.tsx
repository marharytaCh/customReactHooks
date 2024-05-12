import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthService } from '../services/auth'; // directory with services

type Props = {
    children?: ReactNode;
};

type IAuthContext = {
    isAuthenticated: boolean | null;
    setIsAuthenticated: (newState: boolean) => void;
    logout: () => void;
    clearAuthState: () => void;
};

const initialValue = {
    isAuthenticated: null,
    setIsAuthenticated: () => {
        return;
    },
    logout: () => {
        return;
    },
    clearAuthState: () => {
        return;
    },
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
    const authService = useAuthService();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const clearAuthState = () => {
        setIsAuthenticated(false);
    };

    const logout = async () => {
        try {
            const logoutResult = await authService.logOut();
            if (logoutResult) {
                clearAuthState();
            }
        } catch (error) {
            console.error('Error logging out:', error);
            clearAuthState();
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await authService.checkAuthStatus();
                setIsAuthenticated(response.ok);
            } catch (error) {
                console.log('Error checking auth status:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Memoized value of the authentication context
    const contextValue = useMemo(() => {
        return {
            isAuthenticated,
            setIsAuthenticated,
            logout,
            clearAuthState,
        };
    }, [isAuthenticated]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
