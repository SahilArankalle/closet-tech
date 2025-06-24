
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const { data, error } = await supabase
        .from('clothes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clothes:', error);
        setError('Failed to fetch clothing items');
        return;
      }

      setClothes((data as ClothingItem[]) || []);
    } catch (error) {
      console.error('Error:', error);
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

    try {
      setError(null);
      const { data, error } = await supabase
        .from('clothes')
        .insert([{ ...item, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error adding clothing item:', error);
        throw new Error('Failed to add clothing item');
      }

      setClothes(prev => [(data as ClothingItem), ...prev]);
      return data as ClothingItem;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const deleteClothingItem = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('clothes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting clothing item:', error);
        throw new Error('Failed to delete clothing item');
      }

      setClothes(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL for the uploaded image
      const { data } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
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
