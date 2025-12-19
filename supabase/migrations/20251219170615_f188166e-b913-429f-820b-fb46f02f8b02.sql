-- Add accident history column to assessment_requests
ALTER TABLE public.assessment_requests
ADD COLUMN accident_history boolean DEFAULT NULL;