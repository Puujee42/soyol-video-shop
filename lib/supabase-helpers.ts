/**
 * Supabase Helper Functions
 * 
 * This file contains utility functions for working with Supabase
 * alongside Prisma in your Next.js application.
 */

import { supabase, getSupabaseAdmin } from './supabase';

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Upload a product image to Supabase Storage
 * @param file - The file to upload
 * @param productId - The product ID for organizing files
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { 
      url: null, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

/**
 * Delete a product image from Supabase Storage
 * @param imageUrl - The full URL or path of the image to delete
 */
export async function deleteProductImage(
  imageUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/storage/v1/object/public/product-images/');
    const filePath = urlParts[1] || imageUrl;

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    };
  }
}

/**
 * Upload multiple product images
 * @param files - Array of files to upload
 * @param productId - The product ID for organizing files
 * @returns Array of public URLs
 */
export async function uploadMultipleProductImages(
  files: File[],
  productId: string
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = await uploadProductImage(file, productId);
    if (result.url) {
      urls.push(result.url);
    } else if (result.error) {
      errors.push(result.error);
    }
  }

  return { urls, errors };
}

// ============================================
// REALTIME HELPERS
// ============================================

/**
 * Subscribe to product changes in realtime
 * @param callback - Function to call when products change
 * @returns Subscription object (call .unsubscribe() to cleanup)
 */
export function subscribeToProductChanges(
  callback: (payload: any) => void
) {
  return supabase
    .channel('products-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Product',
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to a specific product's changes
 * @param productId - The product ID to watch
 * @param callback - Function to call when the product changes
 */
export function subscribeToProductById(
  productId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`product-${productId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'Product',
        filter: `id=eq.${productId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to order changes for vendor dashboard
 * @param storeId - The store ID to watch
 * @param callback - Function to call when orders change
 */
export function subscribeToStoreOrders(
  storeId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`store-orders-${storeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'OrderItem',
        filter: `storeId=eq.${storeId}`,
      },
      callback
    )
    .subscribe();
}

// ============================================
// ANALYTICS HELPERS
// ============================================

/**
 * Log product view (for analytics)
 * Uses Supabase Admin to bypass RLS if needed
 * @param productId - The product ID
 * @param userId - Optional user ID
 */
export async function logProductView(
  productId: string,
  userId?: string
): Promise<void> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Log the view to an analytics table (you'd need to create this)
    await supabaseAdmin.from('product_views').insert({
      product_id: productId,
      user_id: userId || null,
      viewed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log product view:', error);
  }
}

// ============================================
// AUTHENTICATION HELPERS
// ============================================

/**
 * Get current user from Supabase Auth
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

/**
 * Sign out
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

// ============================================
// DATABASE FUNCTIONS
// ============================================

/**
 * Call a Supabase database function
 * (You can create custom functions in Supabase SQL Editor)
 */
export async function callDatabaseFunction(
  functionName: string,
  params?: Record<string, any>
) {
  return await supabase.rpc(functionName, params);
}

/**
 * Example: Get trending products using a custom database function
 * First, create this function in Supabase SQL Editor:
 * 
 * CREATE OR REPLACE FUNCTION get_trending_products(days INT DEFAULT 7)
 * RETURNS TABLE (
 *   id TEXT,
 *   name TEXT,
 *   total_views BIGINT
 * ) AS $$
 * BEGIN
 *   RETURN QUERY
 *   SELECT p.id, p.name, p.views
 *   FROM "Product" p
 *   WHERE p."createdAt" > NOW() - INTERVAL '1 day' * days
 *   ORDER BY p.views DESC
 *   LIMIT 10;
 * END;
 * $$ LANGUAGE plpgsql;
 */
export async function getTrendingProducts(days: number = 7) {
  return await callDatabaseFunction('get_trending_products', { days });
}

// ============================================
// EDGE FUNCTIONS HELPERS
// ============================================

/**
 * Call a Supabase Edge Function
 * @param functionName - Name of the edge function
 * @param body - Request body
 */
export async function callEdgeFunction(
  functionName: string,
  body?: Record<string, any>
) {
  return await supabase.functions.invoke(functionName, {
    body,
  });
}
