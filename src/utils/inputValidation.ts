
export const validateClothingItem = (item: {
  name?: string;
  color: string;
  category: string;
  occasion: string;
}) => {
  const errors: string[] = [];

  // Validate name length
  if (item.name && item.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  // Validate color length
  if (item.color.length > 50) {
    errors.push('Color must be 50 characters or less');
  }

  // Validate category
  const validCategories = ['top', 'bottom', 'shoes', 'accessory', 'outerwear'];
  if (!validCategories.includes(item.category)) {
    errors.push('Invalid category selected');
  }

  // Validate occasion
  const validOccasions = ['casual', 'formal', 'business', 'sport', 'party'];
  if (!validOccasions.includes(item.occasion)) {
    errors.push('Invalid occasion selected');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length as additional safety
};

export const validateImageFile = (file: File) => {
  const errors: string[] = [];
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed');
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push('Invalid file extension');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
