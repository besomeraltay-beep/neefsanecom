-- ================================================================
-- NEEFSANE E-TİCARET BULUT VERİTABANI ŞEMASI (SUPABASE POSTGRESQL)
-- ================================================================
-- Bu dosyayı Supabase Dashboard -> SQL Editor alanına yapıştırıp "RUN" 
-- butonuna basarak tüm veritabanınızı 10 saniyede hazır hale getirebilirsiniz.

-- 1. ÜRÜNLER TABLOSU (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_name TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  stock_count INTEGER DEFAULT 10,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 1,
  tag TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  models JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SİPARİŞLER TABLOSU (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Hazırlanıyor' NOT NULL,
  courier TEXT DEFAULT 'MNG Kargo',
  tracking_number TEXT,
  tracking_url TEXT,
  payment_method TEXT DEFAULT 'Kredi Kartı',
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  timeline JSONB DEFAULT '[]'::jsonb,
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. KUPONLAR TABLOSU (coupons)
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'percent' NOT NULL,
  value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  label TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MAĞAZA AYARLARI TABLOSU (settings)
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- ROW LEVEL SECURITY (GÜVENLİK VE ERİŞİM İZİNLERİ)
-- ================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Herkes ürünleri, kuponları ve mağaza ayarlarını okuyabilir
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);

-- Müşteriler mağazadan sipariş oluşturabilir
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);

-- Yönetim işlemleri için tam erişim (Anon/Authenticated)
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Admin Full Access Coupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Admin Full Access Settings" ON public.settings FOR ALL USING (true);

-- ================================================================
-- BAŞLANGIÇ VERİLERİ (SEED DATA)
-- ================================================================

-- Varsayılan Kuponlar
INSERT INTO public.coupons (id, code, type, value, min_spend, label, is_active)
VALUES
  ('c1', 'HOSGELDIN10', 'percent', 0.10, 0, '%10 İlk Sipariş İndirimi', true),
  ('c2', 'EFSANE10', 'percent', 0.10, 300, '%10 Özel İndirim', true),
  ('c3', 'NEEF20', 'percent', 0.20, 600, '%20 Lansman İndirimi', true)
ON CONFLICT (code) DO NOTHING;

-- Varsayılan Mağaza Ayarları
INSERT INTO public.settings (key, value)
VALUES
  ('freeShippingThreshold', '500'::jsonb),
  ('phone', '"0850 300 00 00"'::jsonb),
  ('whatsapp', '"905000000000"'::jsonb),
  ('storeName', '"NEEFSANE"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- İlk 25 Ürün Yüklemesi
INSERT INTO public.products (id, name, category, category_name, price, discount_price, stock_count, rating, reviews_count, tag, is_featured, is_bestseller, is_new, image, images, description, models, colors, features)
VALUES
(
  'neef-3d-01',
  '3D Renkli Porsche 911 GT3 RS Masaüstü Figürü',
  '3d-araba-figuru',
  '3D Araba Figürleri',
  850,
  649,
  18,
  4.9,
  348,
  'ÇOK SATAN',
  true,
  true,
  false,
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  'Porsche 911 GT3 RS aerodinamik gövdesi, devasa arka kanadı ve agresif hava girişleriyle mikron hassasiyetinde 3D modellenmiştir.',
  '["12 cm Kompakt", "16 cm Masaüstü Standlı", "20 cm XL Koleksiyon"]'::jsonb,
  '[{"name":"Lava Turuncusu","hex":"#C2410C"},{"name":"Kertenkele Yeşili","hex":"#22c55e"},{"name":"Mat Siyah","hex":"#0f172a"},{"name":"Safir Mavi","hex":"#2563eb"}]'::jsonb,
  '["Yüksek hassasiyetli çok renkli 3D katman baskısı","Akrilik korumalı özel sergileme standı dahil","Gövde ve jant detayları fırınlanmış dayanıklı boya kaplama"]'::jsonb
),
(
  'neef-3d-02',
  '3D Renkli Nissan Skyline GT-R R34 Masaüstü Figürü',
  '3d-araba-figuru',
  '3D Araba Figürleri',
  890,
  699,
  14,
  5.0,
  412,
  'EFSANE SERİ',
  true,
  true,
  false,
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  'JDM efsanesi R34 GT-R V-Spec II, Bayside Blue gövde rengi ve ikonik yuvarlak stop lambalarıyla çalışma masanızın gözdesi olacak.',
  '["12 cm Kompakt", "16 cm Masaüstü Standlı", "20 cm XL Koleksiyon"]'::jsonb,
  '[{"name":"Bayside Mavisi","hex":"#1d4ed8"},{"name":"Gece Siyahı","hex":"#0f172a"},{"name":"Kutup Beyazı","hex":"#f8fafc"}]'::jsonb,
  '["İkonik RB26DETT motor kaputu detayları","Özel gravürlü GT-R metal tabela plaket","Hassas aerodinamik spoiler ve difüzör"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
