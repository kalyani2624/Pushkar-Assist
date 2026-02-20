
-- Posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Anyone can create posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete own posts" ON public.posts FOR DELETE USING (true);

-- Post likes
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can like" ON public.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can unlike" ON public.post_likes FOR DELETE USING (true);

-- Post comments
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can comment" ON public.post_comments FOR INSERT WITH CHECK (true);

-- Missing items
CREATE TABLE public.missing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  lost_location TEXT,
  contact_number TEXT NOT NULL,
  address TEXT,
  is_found BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.missing_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read items" ON public.missing_items FOR SELECT USING (true);
CREATE POLICY "Anyone can report items" ON public.missing_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update items" ON public.missing_items FOR UPDATE USING (true);

-- Crowd reports
CREATE TABLE public.crowd_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ghat_name TEXT NOT NULL,
  crowd_level TEXT NOT NULL DEFAULT 'low',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read crowd" ON public.crowd_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can report crowd" ON public.crowd_reports FOR INSERT WITH CHECK (true);

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
CREATE POLICY "Anyone can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Anyone can read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Enable realtime for crowd reports
ALTER PUBLICATION supabase_realtime ADD TABLE public.crowd_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
