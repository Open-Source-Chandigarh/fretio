-- =====================================================
-- Create Products Tables and Seed Data
-- =====================================================
-- Run this AFTER running create-and-seed-categories.sql
-- This creates the products and product_images tables with sample data

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  listing_type TEXT CHECK (listing_type IN ('sell', 'rent', 'both')),
  sell_price DECIMAL(10,2),
  rent_price_per_day DECIMAL(10,2),
  rent_price_per_month DECIMAL(10,2),
  seller_id UUID NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'unavailable')),
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create product_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
  ON public.products 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
CREATE POLICY "Users can insert their own products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
CREATE POLICY "Users can update their own products" 
  ON public.products 
  FOR UPDATE 
  USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
CREATE POLICY "Users can delete their own products" 
  ON public.products 
  FOR DELETE 
  USING (auth.uid() = seller_id);

-- Create RLS policies for product_images
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON public.product_images;
CREATE POLICY "Product images are viewable by everyone" 
  ON public.product_images 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can manage images for their products" ON public.product_images;
CREATE POLICY "Users can manage images for their products" 
  ON public.product_images 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_images.product_id 
      AND products.seller_id = auth.uid()
    )
  );

-- Now insert sample products
DO $$
DECLARE 
  sample_user_id UUID;
  cat_books UUID;
  cat_electronics UUID;
  cat_clothing UUID;
  cat_furniture UUID;
  cat_sports UUID;
  cat_gaming UUID;
  cat_kitchen UUID;
  product_id UUID;
BEGIN
  -- Get the first user ID (you need at least one user in the system)
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  -- If no user exists, create a sample one (optional - remove if not needed)
  IF sample_user_id IS NULL THEN
    -- You can't directly insert into auth.users from here
    -- So we'll just show a notice and exit
    RAISE NOTICE 'No users found. Please create at least one user account first, then run this script again.';
    RETURN;
  END IF;

  -- Get category IDs
  SELECT id INTO cat_books FROM public.categories WHERE name = 'Books & Study Material';
  SELECT id INTO cat_electronics FROM public.categories WHERE name = 'Electronics';
  SELECT id INTO cat_clothing FROM public.categories WHERE name = 'Clothing & Fashion';
  SELECT id INTO cat_furniture FROM public.categories WHERE name = 'Furniture';
  SELECT id INTO cat_sports FROM public.categories WHERE name = 'Sports & Fitness';
  SELECT id INTO cat_gaming FROM public.categories WHERE name = 'Gaming';
  SELECT id INTO cat_kitchen FROM public.categories WHERE name = 'Kitchen & Appliances';

  -- Clear existing sample products (optional - remove if you want to keep existing data)
  -- DELETE FROM public.products WHERE seller_id = sample_user_id;

  -- Insert Books
  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Engineering Mathematics - Kreyszig', 'Advanced Engineering Mathematics 10th Edition. Excellent condition, no markings.', 
     cat_books, 'like_new', 'sell', 450, sample_user_id, 'available', 15)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Data Structures & Algorithms', 'Classic textbook by Cormen. Some highlighting but overall good condition.', 
     cat_books, 'good', 'sell', 350, sample_user_id, 'available', 8)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, rent_price_per_day, seller_id, status, views_count)
  VALUES 
    ('Organic Chemistry - Morrison Boyd', 'Standard organic chemistry textbook. Available for rent or purchase.', 
     cat_books, 'good', 'both', 400, 20, sample_user_id, 'available', 12)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', true, 0);

  -- Insert Electronics
  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count, is_featured)
  VALUES 
    ('Dell Inspiron 15 Laptop', '8GB RAM, 512GB SSD, Intel i5 11th Gen. Perfect for coding and assignments.', 
     cat_electronics, 'good', 'sell', 28000, sample_user_id, 'available', 45, true)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('JBL Bluetooth Speaker', 'Portable speaker with excellent bass. 10 hours battery life.', 
     cat_electronics, 'like_new', 'sell', 1800, sample_user_id, 'available', 22)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, rent_price_per_day, rent_price_per_month, seller_id, status, views_count)
  VALUES 
    ('Scientific Calculator Casio fx-991ES', 'Essential for engineering exams. Available for rent.', 
     cat_electronics, 'new', 'rent', 10, 200, sample_user_id, 'available', 18)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=600', true, 0);

  -- Insert Clothing
  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Formal Blazer (Size M)', 'Navy blue formal blazer, worn twice for interviews. Perfect condition.', 
     cat_clothing, 'like_new', 'sell', 1500, sample_user_id, 'available', 10)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Winter Jacket - Unisex', 'Warm winter jacket, size L. Good for cold hostel nights.', 
     cat_clothing, 'good', 'sell', 800, sample_user_id, 'available', 5)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600', true, 0);

  -- Insert Furniture
  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count, is_featured)
  VALUES 
    ('Study Table with Bookshelf', 'Wooden study table with attached bookshelf. Perfect for dorm rooms.', 
     cat_furniture, 'good', 'sell', 2500, sample_user_id, 'available', 30, true)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Ergonomic Study Chair', 'Comfortable chair with lumbar support. Great for long study sessions.', 
     cat_furniture, 'like_new', 'sell', 1800, sample_user_id, 'available', 25)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, rent_price_per_month, seller_id, status, views_count)
  VALUES 
    ('Mini Fridge', 'Compact refrigerator perfect for dorm room. Available for monthly rent.', 
     cat_furniture, 'good', 'rent', 500, sample_user_id, 'available', 40)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600', true, 0);

  -- Insert Sports
  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Badminton Racket Set', 'Two rackets with shuttlecocks and carrying case.', 
     cat_sports, 'good', 'sell', 600, sample_user_id, 'available', 8)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1615117950029-db3cf44bdefa?w=600', true, 0);

  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, rent_price_per_day, seller_id, status, views_count)
  VALUES 
    ('Yoga Mat - Premium Quality', 'Thick yoga mat with carrying strap. Can rent for events.', 
     cat_sports, 'new', 'both', 400, 20, sample_user_id, 'available', 6)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', true, 0);

  -- Insert Gaming
  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('PlayStation 4 Console', '500GB storage with 2 controllers and 5 games included.', 
     cat_gaming, 'good', 'sell', 15000, sample_user_id, 'available', 35)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600', true, 0);

  -- Insert Kitchen
  INSERT INTO public.products (title, description, category_id, condition, listing_type, sell_price, seller_id, status, views_count)
  VALUES 
    ('Electric Kettle 1.5L', 'Fast boiling kettle with auto shut-off. Perfect for instant noodles and tea.', 
     cat_kitchen, 'like_new', 'sell', 500, sample_user_id, 'available', 12)
  RETURNING id INTO product_id;
  
  INSERT INTO public.product_images (product_id, image_url, is_primary, sort_order)
  VALUES (product_id, 'https://images.unsplash.com/photo-1565452372282-0638fa9ad973?w=600', true, 0);

  RAISE NOTICE 'Sample products created successfully!';
END $$;

-- Verify products were inserted
SELECT p.id, p.title, c.name as category, p.condition, p.listing_type, p.sell_price, p.status 
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
ORDER BY p.created_at DESC
LIMIT 20;

-- Count total products
SELECT COUNT(*) as total_products FROM public.products WHERE status = 'available';
