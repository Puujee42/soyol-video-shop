# Supabase + Prisma Usage Examples

This file contains practical examples of using Supabase alongside Prisma in your Next.js application.

## Overview

Your application now uses:
- **Prisma**: For database operations (CRUD on products, orders, users, etc.)
- **Supabase Client**: For realtime features, authentication, and file storage

## 1. Product CRUD Operations with Prisma

### Create a Product (API Route)

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        images: body.images || [],
        quantity: body.quantity,
        storeId: body.storeId,
        categoryId: body.categoryId,
        stockStatus: body.quantity > 0 ? 'in-stock' : 'out-of-stock',
      },
      include: {
        store: true,
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

### Get Products with Pagination

```typescript
// app/api/products/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  try {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          store: true,
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### Update Product Stock

```typescript
// app/api/products/[id]/stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await request.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        quantity,
        stockStatus:
          quantity > 10
            ? 'in-stock'
            : quantity > 0
            ? 'low-stock'
            : 'out-of-stock',
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}
```

## 2. Product Image Upload with Supabase Storage

### Upload Product Images (API Route)

```typescript
// app/api/products/[id]/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadMultipleProductImages } from '@/lib/supabase-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Upload images to Supabase Storage
    const { urls, errors } = await uploadMultipleProductImages(
      files,
      params.id
    );

    if (errors.length > 0) {
      console.error('Some images failed to upload:', errors);
    }

    // Update product with new image URLs
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        images: {
          push: urls, // Append new images to existing array
        },
      },
    });

    return NextResponse.json({
      product,
      uploadedCount: urls.length,
      failedCount: errors.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
```

### Client-Side Image Upload Component

```typescript
// components/ProductImageUpload.tsx
'use client';

import { useState } from 'react';
import { uploadProductImage } from '@/lib/supabase-helpers';

export default function ProductImageUpload({ productId }: { productId: string }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const { url, error } = await uploadProductImage(file, productId);

    if (error) {
      alert('Upload failed: ' + error);
    } else if (url) {
      setImageUrl(url);
      // Now update the product in your database
      await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [url], // Add to images array
        }),
      });
    }

    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-32 h-32" />}
    </div>
  );
}
```

## 3. Realtime Product Updates

### Subscribe to Product Changes (Client Component)

```typescript
// components/RealtimeProductList.tsx
'use client';

import { useEffect, useState } from 'react';
import { subscribeToProductChanges } from '@/lib/supabase-helpers';

export default function RealtimeProductList({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    // Subscribe to product changes
    const subscription = subscribeToProductChanges((payload) => {
      console.log('Product changed:', payload);

      if (payload.eventType === 'INSERT') {
        setProducts((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.new.id ? payload.new : p))
        );
      } else if (payload.eventType === 'DELETE') {
        setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Server Component (Fetch Initial Data)

```typescript
// app/products/page.tsx
import { prisma } from '@/lib/prisma';
import RealtimeProductList from '@/components/RealtimeProductList';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1>Products (Realtime)</h1>
      <RealtimeProductList initialProducts={products} />
    </div>
  );
}
```

## 4. Advanced Queries

### Get Featured Products with Store Info

```typescript
const featuredProducts = await prisma.product.findMany({
  where: {
    featured: true,
    quantity: { gt: 0 },
  },
  include: {
    store: {
      select: {
        name: true,
        logo: true,
        rating: true,
      },
    },
    category: {
      select: {
        name: true,
        slug: true,
      },
    },
  },
  orderBy: {
    totalSales: 'desc',
  },
  take: 10,
});
```

### Get Products by Category with Subcategories

```typescript
const categoryProducts = await prisma.product.findMany({
  where: {
    category: {
      OR: [
        { slug: categorySlug },
        { parent: { slug: categorySlug } },
      ],
    },
  },
  include: {
    store: true,
    category: true,
  },
});
```

### Get Trending Products (Most Views Last 7 Days)

```typescript
const trendingProducts = await prisma.product.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  },
  orderBy: {
    views: 'desc',
  },
  take: 10,
  include: {
    store: true,
    category: true,
  },
});
```

### Get Low Stock Products (for Vendor Dashboard)

```typescript
const lowStockProducts = await prisma.product.findMany({
  where: {
    storeId: vendorStoreId,
    quantity: {
      lt: 10,
      gt: 0,
    },
  },
  orderBy: {
    quantity: 'asc',
  },
});
```

## 5. Prisma + Supabase Storage Integration

### Complete Product Creation Flow

```typescript
// app/api/products/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadMultipleProductImages } from '@/lib/supabase-helpers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract product data
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const storeId = formData.get('storeId') as string;
    const categoryId = formData.get('categoryId') as string;
    const description = formData.get('description') as string;
    
    // Extract image files
    const imageFiles = formData.getAll('images') as File[];

    // 1. Create product first (without images)
    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        price,
        storeId,
        categoryId,
        description,
        quantity: 0, // Will update after images
        images: [], // Will update after upload
      },
    });

    // 2. Upload images to Supabase Storage
    const { urls, errors } = await uploadMultipleProductImages(
      imageFiles,
      product.id
    );

    if (errors.length > 0) {
      console.error('Image upload errors:', errors);
    }

    // 3. Update product with image URLs
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        images: urls,
      },
      include: {
        store: true,
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      uploadedImages: urls.length,
      failedImages: errors.length,
    });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

## 6. Optimistic UI Updates

```typescript
// components/ProductStock.tsx
'use client';

import { useState, useTransition } from 'react';

export default function ProductStock({ 
  productId, 
  initialStock 
}: { 
  productId: string; 
  initialStock: number 
}) {
  const [stock, setStock] = useState(initialStock);
  const [isPending, startTransition] = useTransition();

  const updateStock = async (newStock: number) => {
    // Optimistic update
    setStock(newStock);

    startTransition(async () => {
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newStock }),
      });

      if (!response.ok) {
        // Rollback on error
        setStock(initialStock);
      }
    });
  };

  return (
    <div>
      <p>Stock: {stock}</p>
      <button
        onClick={() => updateStock(stock + 1)}
        disabled={isPending}
      >
        Increase Stock
      </button>
    </div>
  );
}
```

## 7. Server Actions (Next.js 15)

```typescript
// app/actions/products.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function incrementProductViews(productId: string) {
  await prisma.product.update({
    where: { id: productId },
    data: {
      views: { increment: 1 },
    },
  });

  revalidatePath(`/product/${productId}`);
}

export async function toggleFeaturedProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      featured: !product?.featured,
    },
  });

  revalidatePath('/products');
  return updated;
}
```

## 8. Useful SQL Queries (Run in Supabase SQL Editor)

### Enable Realtime for Products Table

```sql
ALTER TABLE "Product" REPLICA IDENTITY FULL;
```

### Create Index for Better Performance

```sql
-- Index for product search
CREATE INDEX idx_product_name_search ON "Product" USING gin(to_tsvector('english', name));

-- Index for price filtering
CREATE INDEX idx_product_price ON "Product"(price);

-- Index for featured products
CREATE INDEX idx_product_featured_created ON "Product"(featured, "createdAt" DESC);
```

### Create a View for Popular Products

```sql
CREATE VIEW popular_products AS
SELECT 
  p.*,
  s.name as store_name,
  c.name as category_name
FROM "Product" p
JOIN "Store" s ON p."storeId" = s.id
JOIN "Category" c ON p."categoryId" = c.id
WHERE p.views > 100
ORDER BY p.views DESC;
```

## Summary

Your setup now uses:

1. **Prisma** for all database CRUD operations
2. **Supabase Storage** for product images
3. **Supabase Realtime** for live product updates
4. **Supabase Auth** (optional) for authentication
5. **Supabase Edge Functions** (optional) for serverless functions

This gives you the best of both worlds: type-safe database operations with Prisma and powerful realtime features with Supabase!
