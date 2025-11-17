import { NextResponse, type NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db'

const supabase = getDatabase

// GET - Fetch reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const rating = searchParams.get('rating')

    let query = supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order(sortBy, { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by rating if provided
    if (rating) {
      query = query.eq('rating', parseInt(rating))
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch reviews'
      }, { status: 500 })
    }

    // Get average rating and count
    const { data: stats } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId)

    const avgRating = stats && stats.length > 0
      ? stats.reduce((sum, r) => sum + r.rating, 0) / stats.length
      : 0

    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: stats?.filter(r => r.rating === rating).length || 0
    }))

    return NextResponse.json({
      success: true,
      data: reviews || [],
      totalReviews: stats?.length || 0,
      averageRating: Math.round(avgRating * 10) / 10,
      ratingDistribution,
      hasMore: (reviews?.length || 0) === limit
    })
  } catch (error) {
    console.error('Error in GET /api/products/[id]/reviews:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    }, { status: 500 });
  }
}

// POST - create new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  try {
    const body = await request.json();
    
    const {
      userId,
      userName,
      userEmail,
      rating,
      title,
      reviewText,
      images,
      verifiedPurchase
    } = body

    // Validation
    if (!userId || !userName || !userEmail || !rating) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Check if user already reviewed this product
    const { data: existing } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'You have already reviewed this product'
      }, { status: 400 })
    }

    // Insert review
    const { data: review, error } = await supabase
      .from('product_reviews')
      .insert({
        product_id: productId,
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        rating,
        title: title || null,
        review_text: reviewText || null,
        images: images || [],
        verified_purchase: verifiedPurchase || false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to create review'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/products/[id]/reviews:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create review' 
    }, { status: 500 });
  }
}