import { createContext, ReactNode, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

interface ToastContextProps {
    toasts: Toast[];
    showToast: (message: string, type: 'success' | 'error') => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: 'success' | 'error') => {
        const toast: Toast = {
            id: Date.now(),
            message,
            type,
        };

        setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const removeToast = (id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const handleClose = (id: number) => {
        removeToast(id);
    };

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            {toasts.map((toast) => (
                <Snackbar key={toast.id} open autoHideDuration={5000} onClose={() => handleClose(toast.id)}>
                    <MuiAlert elevation={6} variant='filled' onClose={() => handleClose(toast.id)} severity={toast.type}>
                        {toast.message}
                    </MuiAlert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
};

export default ToastProvider;