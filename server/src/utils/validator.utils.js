export const EMAIL_RULE = /^\S+@\S+\.\S+$/;
export const EMAIL_RULE_MESSAGE = 'Email is invalid.';

export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]).{8,30}$/;
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 uppercase letter, 1 lowercase letter, a number, 1 special character, and at least 8 characters';

export const OBJECT_ID_RULE = /^[a-f\d]{24}$/i;
export const OBJECT_ID_RULE_MESSAGE = "Value must be a valid MongoDB ObjectId";
