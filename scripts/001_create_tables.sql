-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- duration in seconds
  views INTEGER DEFAULT 0,
  category TEXT,
  tags TEXT[], -- array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Action', 'action', 'Action videos'),
  ('Comedy', 'comedy', 'Comedy videos'),
  ('Drama', 'drama', 'Drama videos'),
  ('Documentary', 'documentary', 'Documentary videos'),
  ('Music', 'music', 'Music videos')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON public.videos(views DESC);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view videos)
CREATE POLICY "Allow public to view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public to view categories" ON public.categories FOR SELECT USING (true);
