import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const products = await request.json();
    
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Request body must be an array of products' },
        { status: 400 }
      );
    }

    const { data: result, error } = await supabase
      .from('products')
      .insert(products)
      .select()
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({
          error: 'Some products were duplicates and skipped',
          message: 'Duplicate products found'
        }, { status: 400 });
      }
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${result?.length || 0} products`,
      insertedCount: result?.length || 0
    });

  } catch (error: any) {
    console.error('Bulk product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to add products', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST method to bulk add products' });
}