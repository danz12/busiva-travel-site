import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://cqjvoofsjblatltqalxp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxanZvb2ZzamJsYXRsdHFhbHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTc4NDAsImV4cCI6MjA4MzkzMzg0MH0.0zskwidc4lY0ZH8SdedzKMXRKik-rJZAel517tLy87g';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase, supabaseAnonKey, supabaseUrl };
