
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
      
      // Process image URLs to ensure they're accessible
      const processedClothes = (data as ClothingItem[]).map(item => {
        let processedImageUrl = item.image_url;
        
        // If the image URL doesn't start with https, it might be a storage path
        if (processedImageUrl && !processedImageUrl.startsWith('https://')) {
          // Extract the file path from the full URL if needed
          const urlParts = processedImageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const userPath = urlParts[urlParts.length - 2];
          
          if (userPath && fileName) {
            const { data: urlData } = supabase.storage
              .from('clothing-images')
              .getPublicUrl(`${userPath}/${fileName}`);
            processedImageUrl = urlData.publicUrl;
          }
        }
        
        console.log('useClothes: Processing item:', item.name, 'Original URL:', item.image_url, 'Processed URL:', processedImageUrl);
        
        return {
          ...item,
          image_url: processedImageUrl
        };
      });

      setClothes(processedClothes);
      console.log('useClothes: Final processed clothes:', processedClothes);
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
      
      // Process the image URL for the new item
      const newItem = data as ClothingItem;
      let processedImageUrl = newItem.image_url;
      
      if (processedImageUrl && !processedImageUrl.startsWith('https://')) {
        const urlParts = processedImageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const userPath = urlParts[urlParts.length - 2];
        
        if (userPath && fileName) {
          const { data: urlData } = supabase.storage
            .from('clothing-images')
            .getPublicUrl(`${userPath}/${fileName}`);
          processedImageUrl = urlData.publicUrl;
        }
      }
      
      const processedNewItem = {
        ...newItem,
        image_url: processedImageUrl
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
          const urlParts = itemToDelete.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const userPath = urlParts[urlParts.length - 2];
          
          if (userPath && fileName) {
            await supabase.storage
              .from('clothing-images')
              .remove([`${userPath}/${fileName}`]);
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

      // Get public URL for the uploaded image
      const { data } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(fileName);

      console.log('useClothes: Generated public URL:', data.publicUrl);
      
      return data.publicUrl;
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
