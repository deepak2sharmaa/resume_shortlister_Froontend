// export const isEmail = (v: string) =>
//   /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);

// export const isTenDigits = (v: string) => /^[0-9]{10}$/.test(v);

// export const passwordsMatch = (a: string, b: string) => a === b;




export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  createdAt: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const validateOTP = (otp: string): boolean => {
  return otp.length === 6 && /^\d{6}$/.test(otp);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};