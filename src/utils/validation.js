// Form Validation Utilities

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
};

export const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return '';
};

export const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters long';
    if (name.length > 50) return 'Name must not exceed 50 characters';
    return '';
};

export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`;
    }
    return '';
};

export const validateUrl = (url) => {
    if (!url) return '';
    try {
        new URL(url);
        return '';
    } catch {
        return 'Please enter a valid URL';
    }
};

export const validateProjectTitle = (title) => {
    if (!title) return 'Project title is required';
    if (title.length < 3) return 'Title must be at least 3 characters long';
    if (title.length > 100) return 'Title must not exceed 100 characters';
    return '';
};

export const validateProjectDescription = (description) => {
    if (!description) return 'Project description is required';
    if (description.length < 10) return 'Description must be at least 10 characters long';
    if (description.length > 2000) return 'Description must not exceed 2000 characters';
    return '';
};

export const validateDate = (date) => {
    if (!date) return 'Date is required';
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) return 'Please enter a valid date';
    return '';
};

export const validateFileSize = (file, maxSizeMB = 5) => {
    if (!file) return '';
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return `File size must not exceed ${maxSizeMB}MB`;
    }
    return '';
};

export const validateFileType = (file, allowedTypes = []) => {
    if (!file) return '';
    if (allowedTypes.length === 0) return '';

    const fileType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();

    const isAllowed = allowedTypes.some(type => {
        if (type.startsWith('.')) {
            return fileExtension === type.substring(1);
        }
        return fileType.startsWith(type);
    });

    if (!isAllowed) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    return '';
};
