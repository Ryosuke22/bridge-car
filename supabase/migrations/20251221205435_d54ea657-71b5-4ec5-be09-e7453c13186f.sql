-- Add SELECT policy for assessment_photos table (RLS is already enabled)
CREATE POLICY "Only admins can view photos" 
ON public.assessment_photos 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));