
-- Create clothes table to store clothing items
CREATE TABLE public.clothes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('top', 'bottom', 'shoes', 'accessory', 'outerwear')),
  color TEXT NOT NULL,
  occasion TEXT NOT NULL CHECK (occasion IN ('casual', 'formal', 'business', 'sport', 'party')),
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create weekly_plans table
CREATE TABLE public.weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  shirt_id UUID REFERENCES public.clothes(id) ON DELETE CASCADE,
  pant_id UUID REFERENCES public.clothes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, day)
);

-- Create occasion_plans table
CREATE TABLE public.occasion_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  occasion_type TEXT NOT NULL CHECK (occasion_type IN ('wedding', 'party', 'interview', 'festival')),
  shirt_id UUID REFERENCES public.clothes(id) ON DELETE CASCADE,
  pant_id UUID REFERENCES public.clothes(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.clothes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasion_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clothes table
CREATE POLICY "Users can view their own clothes" ON public.clothes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clothes" ON public.clothes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clothes" ON public.clothes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clothes" ON public.clothes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for weekly_plans table
CREATE POLICY "Users can view their own weekly plans" ON public.weekly_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly plans" ON public.weekly_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly plans" ON public.weekly_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly plans" ON public.weekly_plans
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for occasion_plans table
CREATE POLICY "Users can view their own occasion plans" ON public.occasion_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own occasion plans" ON public.occasion_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own occasion plans" ON public.occasion_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own occasion plans" ON public.occasion_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for clothing images
INSERT INTO storage.buckets (id, name, public) VALUES ('clothing-images', 'clothing-images', false);

-- Create storage policies for clothing-images bucket
CREATE POLICY "Users can view their own images" ON storage.objects
  FOR SELECT USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
