-- Add is_premium column to profiles table
-- This migration adds a boolean column to track premium subscription status

-- Add is_premium column with default value false
ALTER TABLE profiles 
ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN profiles.is_premium IS 'Indicates whether the user has an active premium subscription';

-- Create index for efficient querying
CREATE INDEX idx_profiles_is_premium ON profiles(is_premium);