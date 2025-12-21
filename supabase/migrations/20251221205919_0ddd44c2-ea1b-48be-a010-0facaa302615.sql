-- Add SELECT policy for assessment_requests table to protect customer PII
CREATE POLICY "Only admins can view assessments" 
ON public.assessment_requests 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));