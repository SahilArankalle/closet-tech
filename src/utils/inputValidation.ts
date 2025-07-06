
import { sanitizeUserInput, sanitizeHTML } from './security';

export const validateClothingItem = (item: {
  name?: string;
  color: string;
  category: string;
  occasion: string;
}) => {
  const errors: string[] = [];

  // Validate name length and content
  if (item.name) {
    if (item.name.length > 100) {
      errors.push('Name must be 100 characters or less');
    }
    // Check for suspicious content
    if (/[<>]/g.test(item.name)) {
      errors.push('Name contains invalid characters');
    }
  }

  // Validate color length and content
  if (item.color.length > 50) {
    errors.push('Color must be 50 characters or less');
  }
  if (item.color.length === 0) {
    errors.push('Color is required');
  }
  if (/[<>]/g.test(item.color)) {
    errors.push('Color contains invalid characters');
  }

  // Validate category - strict whitelist
  const validCategories = ['top', 'bottom', 'shoes', 'accessory', 'outerwear'];
  if (!validCategories.includes(item.category)) {
    errors.push('Invalid category selected');
  }

  // Validate occasion - strict whitelist
  const validOccasions = ['casual', 'formal', 'business', 'sport', 'party'];
  if (!validOccasions.includes(item.occasion)) {
    errors.push('Invalid occasion selected');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced sanitization with XSS protection
export const sanitizeInput = (input: string): string => {
  return sanitizeUserInput(sanitizeHTML(input));
};

export const validateImageFile = (file: File) => {
  const errors: string[] = [];
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }

  // Minimum file size to prevent empty files
  if (file.size < 100) {
    errors.push('File is too small or corrupted');
  }

  // Check file type - strict whitelist
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed');
  }

  // Check file extension - double validation
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push('Invalid file extension');
  }

  // Additional security: Check for suspicious file names
  if (/[<>:"\\|?*]/g.test(file.name)) {
    errors.push('File name contains invalid characters');
  }

  // Check for double extensions (security risk)
  const extensionCount = (file.name.match(/\./g) || []).length;
  if (extensionCount > 1) {
    errors.push('File name cannot contain multiple extensions');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Additional validation for text inputs
export const validateTextInput = (
  input: string, 
  minLength: number = 0, 
  maxLength: number = 1000,
  fieldName: string = 'Input'
) => {
  const errors: string[] = [];
  
  if (input.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`);
  }
  
  if (input.length > maxLength) {
    errors.push(`${fieldName} must be less than ${maxLength} characters long`);
  }
  
  // Check for potential XSS attempts
  if (/<script|javascript:|data:|vbscript:/gi.test(input)) {
    errors.push(`${fieldName} contains potentially dangerous content`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
