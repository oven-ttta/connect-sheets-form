-- Add YEC member status field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS yec_member_status TEXT DEFAULT 'pending' CHECK (yec_member_status IN ('pending', 'approved', 'rejected'));