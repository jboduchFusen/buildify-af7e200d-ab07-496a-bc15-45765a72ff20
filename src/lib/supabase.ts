
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://igsuuulwunauiioxptxc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc3V1dWx3dW5hdWlpb3hwdHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzU2NTAsImV4cCI6MjA2MzI1MTY1MH0.ea9gr6Akw71O-z84y6t8X4uy0inYgZaf-buO8SDv1QA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Player = {
  id: string;
  name: string;
  email?: string;
  auth_user_id?: string;
  created_at: string;
};

export type Course = {
  id: string;
  name: string;
  holes: number;
  par: number;
  slope: number;
  rating: number;
  tees: string;
  location?: string;
  created_at: string;
};

export type Round = {
  id: string;
  player_id: string;
  course_id: string;
  date: string;
  score: number;
  notes?: string;
  created_at: string;
};
