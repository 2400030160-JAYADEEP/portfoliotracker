import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin) {
            const nameError = validateName(formData.name);
            if (nameError) newErrors.name = nameError;
        }

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setToast({ message: 'Please fix the errors in the form', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                setToast({ message: 'Login successful! Redirecting...', type: 'success' });
                setTimeout(() => navigate('/dashboard'), 1000);
            } else {
                await register(formData.name, formData.email, formData.password);
                setToast({ message: 'Registration successful! Redirecting...', type: 'success' });
                setTimeout(() => navigate('/dashboard'), 1000);
            }
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '' });
        setErrors({});
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-gradient-orb orb-1"></div>
                <div className="auth-gradient-orb orb-2"></div>
                <div className="auth-gradient-orb orb-3"></div>
            </div>

            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="logo-icon">
                                {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
                            </div>
                            <h1 className="auth-title">PortfolioHub</h1>
                        </div>
                        <p className="auth-subtitle">
                            {isLogin
                                ? 'Welcome back! Sign in to your account'
                                : 'Create your account to get started'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form" noValidate>
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name" className="form-label required">
                                    Full Name
                                </label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`form-input ${errors.name ? 'error' : ''}`}
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.name && (
                                    <div className="form-error">{errors.name}</div>
                                )}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label required">
                                Email Address
                            </label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="Enter your email"
                                    disabled={loading}
                                />
                            </div>
                            {errors.email && (
                                <div className="form-error">{errors.email}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label required">
                                Password
                            </label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="form-error">{errors.password}</div>
                            )}
                            {!isLogin && !errors.password && (
                                <div className="form-help">
                                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>
                                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <div className="auth-footer">
                        <p className="auth-switch-text">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        </p>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="btn btn-ghost auth-switch-btn"
                            disabled={loading}
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </button>
                    </div>

                    <div className="auth-demo-info">
                        <p className="demo-title">Demo Accounts:</p>
                        <div className="demo-accounts">
                            <div className="demo-account">
                                <strong>Admin:</strong> admin@portfoliohub.com / Admin@123
                            </div>
                            <div className="demo-account">
                                <strong>Student:</strong> student@example.com / Student@123
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Auth;
