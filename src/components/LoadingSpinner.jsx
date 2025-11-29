import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`spinner-inline spinner-${size}`}>
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
