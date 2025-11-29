import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle2 size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertCircle size={20} />,
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={onClose} aria-label="Close">
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
