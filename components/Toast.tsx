import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
)

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); // Auto-close after 5 seconds

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 400); // Corresponds to animation duration
    };

    const isError = type === 'error';
    const title = isError ? 'An Error Occurred' : 'Success!';

    return (
        <div
            className={`
                fixed top-6 right-6 z-50 w-full max-w-sm overflow-hidden rounded-lg shadow-2xl
                bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)]
                border-l-4
                ${isError ? 'border-[var(--color-error)]' : 'border-[var(--color-primary)]'}
                ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
            `}
            role="alert"
        >
            <div className="p-4 flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    {isError ? <ErrorIcon /> : <SuccessIcon />}
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className={`text-sm font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]`}>
                        {title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                    <button
                        type="button"
                        className="inline-flex rounded-md bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:text-[var(--dark-text-secondary)] dark:hover:text-[var(--dark-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <CloseIcon />
                    </button>
                </div>
            </div>
            <div
                className={`h-1 ${isError ? 'bg-[var(--color-error)]' : 'bg-[var(--color-primary)]'} animate-progress`}
                style={{ animationDuration: '5s' }}
            ></div>
        </div>
    );
};

export default Toast;