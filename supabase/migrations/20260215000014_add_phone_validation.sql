-- Add database-level phone number validation for Indonesian format
-- This ensures data integrity even if frontend validation is bypassed

-- Add CHECK constraint for Indonesian phone format
ALTER TABLE public.profiles
ADD CONSTRAINT check_phone_number_format
  CHECK (
    phone_number IS NULL OR
    phone_number ~ '^(\+62|62|0)?8[1-9][0-9]{7,11}$'
  );

-- Add helpful comment
COMMENT ON CONSTRAINT check_phone_number_format ON public.profiles IS
  'Validates Indonesian phone numbers: must start with 08, +628, or 628, followed by 1-9, then 7-11 more digits';

-- Create function to normalize phone numbers to consistent format
CREATE OR REPLACE FUNCTION public.normalize_phone_number(phone TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF phone IS NULL THEN
    RETURN NULL;
  END IF;

  -- Remove all spaces and dashes
  phone := REGEXP_REPLACE(phone, '[\s\-]', '', 'g');

  -- Convert +62 or 62 to 0
  IF phone LIKE '+62%' THEN
    phone := '0' || SUBSTRING(phone FROM 4);
  ELSIF phone LIKE '62%' AND phone NOT LIKE '62%' THEN
    phone := '0' || SUBSTRING(phone FROM 3);
  END IF;

  RETURN phone;
END;
$$;

COMMENT ON FUNCTION public.normalize_phone_number IS 'Normalizes Indonesian phone numbers to consistent 0xxxx format';

-- Optional: Add a trigger to auto-normalize phone numbers on insert/update
CREATE OR REPLACE FUNCTION public.normalize_phone_on_save()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.phone_number := public.normalize_phone_number(NEW.phone_number);
  RETURN NEW;
END;
$$;

-- Uncomment below to enable auto-normalization (optional)
-- CREATE TRIGGER trigger_normalize_phone
--   BEFORE INSERT OR UPDATE ON public.profiles
--   FOR EACH ROW
--   WHEN (NEW.phone_number IS NOT NULL)
--   EXECUTE FUNCTION public.normalize_phone_on_save();
