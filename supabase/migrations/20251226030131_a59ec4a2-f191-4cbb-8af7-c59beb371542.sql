-- 1. assessment_requests テーブルに UPDATE と DELETE ポリシーを追加
CREATE POLICY "Admins can update assessments"
ON public.assessment_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete assessments"
ON public.assessment_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. assessment_photos テーブルに UPDATE と DELETE ポリシーを追加
CREATE POLICY "Admins can update photos"
ON public.assessment_photos
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete photos"
ON public.assessment_photos
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. price_master テーブルに INSERT, UPDATE, DELETE ポリシーを追加
CREATE POLICY "Admins can insert price master"
ON public.price_master
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update price master"
ON public.price_master
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete price master"
ON public.price_master
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. user_roles テーブルに INSERT, UPDATE, DELETE ポリシーを追加（管理者のみ）
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));