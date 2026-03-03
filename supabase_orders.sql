-- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    gst_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'razorpay')),
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Protect the table using RLS (Row Level Security)
-- For a public-facing store where anyone can checkout without logging in:
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT orders (they cannot READ or UPDATE other orders)
CREATE POLICY "Allow public insert to orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Allow admins (if you add auth later) to read all orders
-- Note: Replace 'your_admin_role' or logic if you want an admin dashboard
-- CREATE POLICY "Allow admins to view orders" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
