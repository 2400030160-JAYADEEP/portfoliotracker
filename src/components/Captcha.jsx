import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import './Captcha.css';

const Captcha = ({ onVerify, reset, className = '' }) => {
    const [captchaData, setCaptchaData] = useState({ num1: 0, num2: 0, operator: '+' });
    const [userAnswer, setUserAnswer] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');

    const operators = ['+', '-', '*'];
    const operatorSymbols = {
        '+': '+',
        '-': '−',
        '*': '×'
    };

    const generateCaptcha = useCallback(() => {
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let num1, num2;

        switch (operator) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50) + 25; // Ensure positive result
                num2 = Math.floor(Math.random() * 25) + 1;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                break;
            default:
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
        }

        setCaptchaData({ num1, num2, operator });
        setUserAnswer('');
        setIsVerified(false);
        setError('');
    }, []);

    const calculateCorrectAnswer = useCallback(() => {
        const { num1, num2, operator } = captchaData;
        switch (operator) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            default:
                return 0;
        }
    }, [captchaData]);

    const verifyCaptcha = useCallback(() => {
        const correctAnswer = calculateCorrectAnswer();
        const isCorrect = parseInt(userAnswer) === correctAnswer;
        
        setIsVerified(isCorrect);
        setError(isCorrect ? '' : 'Incorrect answer. Please try again.');
        
        if (onVerify) {
            onVerify(isCorrect);
        }

        return isCorrect;
    }, [userAnswer, calculateCorrectAnswer, onVerify]);

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/[^0-9-]/g, ''); // Allow only numbers and minus sign
        setUserAnswer(value);
        
        if (error) {
            setError('');
        }
        
        if (isVerified) {
            setIsVerified(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyCaptcha();
        }
    };

    const handleRefresh = () => {
        generateCaptcha();
    };

    // Generate initial captcha
    useEffect(() => {
        generateCaptcha();
    }, [generateCaptcha]);

    // Handle reset from parent component
    useEffect(() => {
        if (reset) {
            generateCaptcha();
        }
    }, [reset, generateCaptcha]);

    // Auto-verify when user enters an answer
    useEffect(() => {
        if (userAnswer && userAnswer.length > 0) {
            const timer = setTimeout(() => {
                verifyCaptcha();
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [userAnswer, verifyCaptcha]);

    return (
        <div className={`captcha-container ${className}`}>
            <div className="captcha-header">
                <label className="captcha-label">
                    Security Verification
                    <span className="required">*</span>
                </label>
                <button
                    type="button"
                    className="captcha-refresh"
                    onClick={handleRefresh}
                    title="Generate new question"
                    aria-label="Generate new captcha question"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            <div className="captcha-content">
                <div className="captcha-question">
                    <span className="captcha-expression">
                        {captchaData.num1} {operatorSymbols[captchaData.operator]} {captchaData.num2} =
                    </span>
                    <div className="captcha-input-wrapper">
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className={`captcha-input ${isVerified ? 'verified' : ''} ${error ? 'error' : ''}`}
                            placeholder="?"
                            maxLength="4"
                            autoComplete="off"
                        />
                        {isVerified && (
                            <div className="captcha-success-indicator">✓</div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="captcha-error">{error}</div>
                )}

                {isVerified && (
                    <div className="captcha-success">Verification successful!</div>
                )}
            </div>

            <div className="captcha-help">
                Solve the math problem above to verify you're human
            </div>
        </div>
    );
};

export default Captcha;