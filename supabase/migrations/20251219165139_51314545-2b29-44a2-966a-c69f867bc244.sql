-- Add touch_pen_marks column to assessment_requests
ALTER TABLE public.assessment_requests 
ADD COLUMN touch_pen_marks boolean DEFAULT NULL;