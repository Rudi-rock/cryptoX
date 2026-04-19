export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateWalletAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  // Basic validation for crypto addresses (0x for Ethereum, 1 or 3 for Bitcoin, etc.)
  const addressRegex = /^(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/;
  return addressRegex.test(address);
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !value) {
      errors[field] = `${field} is required`;
    }

    if (fieldRules.type === 'email' && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
    }

    if (fieldRules.min && value && value.length < fieldRules.min) {
      errors[field] = `Minimum ${fieldRules.min} characters required`;
    }
  });

  return errors;
};
