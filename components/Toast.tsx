import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
)

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-close after 5 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const isError = type === 'error';

    const baseClasses = "fixed top-6 right-6 z-50 flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse rounded-lg shadow-lg backdrop-blur-sm";
    const themeClasses = isError 
        ? "text-red-300 bg-red-900/50 border border-red-700/50" 
        : "text-green-300 bg-green-900/50 border border-green-700/50";
    const icon = isError ? <ErrorIcon /> : <SuccessIcon />;

    return (
        <div className={`${baseClasses} ${themeClasses} animate-toast-in`} role="alert">
            <div className="flex-shrink-0">{icon}</div>
            <div className="text-sm font-normal text-gray-200">{message}</div>
            <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-700 inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-white"
                onClick={onClose}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <CloseIcon />
            </button>
        </div>
    );
};

export default Toast;
