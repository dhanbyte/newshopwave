import { supabase } from '@/lib/supabase';

export interface ReviewData {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  is_verified_purchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export async function getProductReviews(productId?: string): Promise<ReviewData[]> {
  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    const { data: reviews, error } = await query;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    
    return reviews || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function addProductReview(reviewData: Omit<ReviewData, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: reviewData.product_id,
        user_id: reviewData.user_id,
        user_name: reviewData.user_name,
        user_email: reviewData.user_email,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        images: reviewData.images,
        is_verified_purchase: reviewData.is_verified_purchase,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding review:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, error: 'Failed to add review' };
  }
}
