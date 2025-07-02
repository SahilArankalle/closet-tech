
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { validateClothingItem, sanitizeInput, validateImageFile } from '@/utils/inputValidation';

export interface ClothingItem {
  id: string;
  user_id: string;
  image_url: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear';
  color: string;
  occasion: 'casual' | 'formal' | 'business' | 'sport' | 'party';
  name?: string;
  created_at: string;
}

export const useClothes = () => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Helper function to generate signed URL for a file path
  const getSignedUrl = async (filePath: string): Promise<string> => {
    try {
      console.log('useClothes: Generating signed URL for path:', filePath);
      
      const { data, error } = await supabase.storage
        .from('clothing-images')
        .createSignedUrl(filePath, 60 * 60 * 24 * 30); // 30 days expiry

      if (error) {
        console.error('useClothes: Error generating signed URL:', error);
        return filePath; // Return original path as fallback
      }

      console.log('useClothes: Generated signed URL:', data.signedUrl);
      return data.signedUrl;
    } catch (error) {
      console.error('useClothes: Unexpected error generating signed URL:', error);
      return filePath; // Return original path as fallback
    }
  };

  // Helper function to extract file path from URL
  const extractFilePath = (url: string): string => {
    if (!url) return '';
    
    // If it's already a signed URL, extract the path from it
    if (url.includes('/storage/v1/object/sign/clothing-images/')) {
      const pathMatch = url.match(/clothing-images\/(.+?)\?/);
      if (pathMatch) {
        return pathMatch[1];
      }
    }
    
    // If it's a public URL, extract the path
    if (url.includes('/storage/v1/object/public/clothing-images/')) {
      const pathMatch = url.match(/clothing-images\/(.+)$/);
      if (pathMatch) {
        return pathMatch[1];
      }
    }
    
    // If it's just a file path
    if (url.includes('/')) {
      const parts = url.split('/');
      return parts[parts.length - 1];
    }
    
    return url;
  };

  const fetchClothes = async () => {
    if (!user) {
      setClothes([]);
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      console.log('useClothes: Fetching clothes for user:', user.id);
      
      const { data, error } = await supabase
        .from('clothes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useClothes: Error fetching clothes:', error);
        setError('Failed to fetch clothing items');
        return;
      }

      console.log('useClothes: Raw data from database:', data);
      
      // Process image URLs to generate signed URLs
      const processedClothes = await Promise.all(
        (data as ClothingItem[]).map(async (item) => {
          const filePath = extractFilePath(item.image_url);
          console.log('useClothes: Processing item:', item.name, 'File path:', filePath);
          
          if (filePath) {
            const signedUrl = await getSignedUrl(filePath);
            return {
              ...item,
              image_url: signedUrl
            };
          }
          
          return item;
        })
      );

      setClothes(processedClothes);
      console.log('useClothes: Final processed clothes with signed URLs:', processedClothes);
    } catch (error) {
      console.error('useClothes: Unexpected error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, [user]);

  const addClothingItem = async (item: Omit<ClothingItem, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate input
    const validation = validateClothingItem(item);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Sanitize inputs
    const sanitizedItem = {
      ...item,
      name: item.name ? sanitizeInput(item.name) : undefined,
      color: sanitizeInput(item.color),
      image_url: item.image_url.trim()
    };

    console.log('useClothes: Adding clothing item:', sanitizedItem);

    try {
      setError(null);
      const { data, error } = await supabase
        .from('clothes')
        .insert([{ ...sanitizedItem, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('useClothes: Error adding clothing item:', error);
        if (error.code === '23514') {
          throw new Error('Invalid input data. Please check your entries.');
        }
        throw new Error('Failed to add clothing item');
      }

      console.log('useClothes: Successfully added clothing item:', data);
      
      // Generate signed URL for the new item
      const newItem = data as ClothingItem;
      const filePath = extractFilePath(newItem.image_url);
      const signedUrl = await getSignedUrl(filePath);
      
      const processedNewItem = {
        ...newItem,
        image_url: signedUrl
      };
      
      // Add to local state immediately
      setClothes(prev => [processedNewItem, ...prev]);
      
      return processedNewItem;
    } catch (error) {
      console.error('useClothes: Error adding item:', error);
      throw error;
    }
  };

  const deleteClothingItem = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      
      // Find the item to get its image URL for cleanup
      const itemToDelete = clothes.find(item => item.id === id);
      
      const { error } = await supabase
        .from('clothes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('useClothes: Error deleting clothing item:', error);
        throw new Error('Failed to delete clothing item');
      }

      // Remove from local state immediately
      setClothes(prev => prev.filter(item => item.id !== id));
      
      // Optional: Clean up the image from storage
      if (itemToDelete?.image_url) {
        try {
          const filePath = extractFilePath(itemToDelete.image_url);
          if (filePath) {
            await supabase.storage
              .from('clothing-images')
              .remove([filePath]);
          }
        } catch (cleanupError) {
          console.warn('useClothes: Failed to cleanup image:', cleanupError);
        }
      }
    } catch (error) {
      console.error('useClothes: Error deleting item:', error);
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Validate file before upload
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    try {
      setError(null);
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log('useClothes: Uploading image with filename:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('useClothes: Error uploading image:', uploadError);
        if (uploadError.message.includes('Payload too large')) {
          throw new Error('File size too large. Please use a smaller image.');
        }
        throw new Error('Failed to upload image');
      }

      console.log('useClothes: Image uploaded successfully, returning file path:', fileName);
      
      // Return the file path, not the URL - we'll generate signed URLs when needed
      return fileName;
    } catch (error) {
      console.error('useClothes: Upload error:', error);
      throw error;
    }
  };

  return {
    clothes,
    loading,
    error,
    addClothingItem,
    deleteClothingItem,
    uploadImage,
    refetch: fetchClothes
  };
};
