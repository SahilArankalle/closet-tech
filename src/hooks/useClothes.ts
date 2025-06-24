
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
  const { user } = useAuth();

  const fetchClothes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('clothes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clothes:', error);
        return;
      }

      // Type assertion to ensure proper typing
      setClothes((data as ClothingItem[]) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, [user]);

  const addClothingItem = async (item: Omit<ClothingItem, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clothes')
        .insert([{ ...item, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error adding clothing item:', error);
        return;
      }

      // Type assertion for the returned data
      setClothes(prev => [(data as ClothingItem), ...prev]);
      return data as ClothingItem;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteClothingItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clothes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting clothing item:', error);
        return;
      }

      setClothes(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      // Get signed URL for the uploaded image
      const { data: signedUrl } = await supabase.storage
        .from('clothing-images')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

      return signedUrl?.signedUrl || null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return {
    clothes,
    loading,
    addClothingItem,
    deleteClothingItem,
    uploadImage,
    refetch: fetchClothes
  };
};
