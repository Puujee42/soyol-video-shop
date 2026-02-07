# Supabase Setup Guide

This guide will help you connect your Next.js project to Supabase and create the products table.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- This Next.js project

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Choose a name (e.g., "amazon-marketplace")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" (this takes 1-2 minutes)

## Step 2: Get Your Connection Strings

### Database Connection Strings (for Prisma)

1. In your Supabase dashboard, go to **Project Settings** (gear icon) > **Database**
2. Scroll down to **Connection string** section
3. Select **URI** tab

**For DATABASE_URL (Transaction Mode):**
- Set connection mode to "Transaction"
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your database password
- Add `?pgbouncer=true` to the end

Example:
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**For DIRECT_URL (Session Mode):**
- Set connection mode to "Session"  
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### API Keys (for Supabase Client)

1. Go to **Project Settings** > **API**
2. You'll see:
   - **Project URL**: Copy this for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: Copy this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: Copy this for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Step 4: Create the Database Schema

Your Prisma schema already includes a comprehensive `Product` model. Now push it to Supabase:

```bash
# Generate Prisma Client
npx prisma generate

# Push the schema to Supabase (creates all tables)
npx prisma db push

# Optional: Seed the database with sample data
npm run db:seed
```

This will create all the tables in your Supabase database, including:
- ✅ **products** - Your main products table
- ✅ users
- ✅ stores
- ✅ categories
- ✅ orders
- ✅ reviews
- ✅ cart
- ✅ wishlist

## Step 5: Verify in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click on **Table Editor** in the sidebar
3. You should see all your tables including `Product`

## Your Product Table Schema

The `Product` table includes these fields:

- `id` - Unique identifier (CUID)
- `name` - Product name
- `slug` - URL-friendly identifier
- `description` - Product description
- `images` - Array of image URLs
- `price` - Current price
- `comparePrice` - Original price (for discounts)
- `sku` - Stock keeping unit
- `quantity` - Available quantity
- `stockStatus` - in-stock, low-stock, out-of-stock, pre-order
- `storeId` - Foreign key to Store
- `categoryId` - Foreign key to Category
- `rating` - Average rating
- `totalReviews` - Number of reviews
- `totalSales` - Number of sales
- `views` - Product views count
- `featured` - Featured product flag
- `tags` - Array of tags for search
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Usage Examples

### Using Prisma (Recommended for CRUD operations)

```typescript
import { prisma } from '@/lib/prisma';

// Get all products
const products = await prisma.product.findMany({
  include: {
    store: true,
    category: true,
  }
});

// Get single product
const product = await prisma.product.findUnique({
  where: { id: 'product-id' },
  include: {
    store: true,
    category: true,
    reviews: true,
  }
});

// Create a product
const newProduct = await prisma.product.create({
  data: {
    name: 'Amazing Product',
    slug: 'amazing-product',
    price: 99.99,
    storeId: 'store-id',
    categoryId: 'category-id',
    images: ['https://example.com/image.jpg'],
    quantity: 100,
  }
});
```

### Using Supabase Client (For realtime, auth, storage)

```typescript
import { supabase } from '@/lib/supabase';

// Realtime subscription to products
const subscription = supabase
  .channel('products-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'Product' },
    (payload) => {
      console.log('Product changed:', payload);
    }
  )
  .subscribe();

// Upload product image to Supabase Storage
const { data, error } = await supabase.storage
  .from('products')
  .upload('product-images/image.jpg', file);
```

## Next Steps

1. ✅ Supabase project created
2. ✅ Environment variables configured
3. ✅ Database schema pushed to Supabase
4. ✅ Products table created

### Optional: Enable Realtime

To enable realtime subscriptions for your products table:

1. Go to **Database** > **Replication** in Supabase dashboard
2. Find the `Product` table
3. Enable replication for INSERT, UPDATE, DELETE events

### Optional: Set up Storage for Product Images

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `products`
3. Set the bucket to public if you want public image URLs
4. Update your product image upload logic to use Supabase Storage

### Optional: Row Level Security (RLS)

Supabase enables RLS by default. You may want to configure policies:

```sql
-- Allow public read access to products
CREATE POLICY "Public products are viewable by everyone"
ON "Product" FOR SELECT
USING (true);

-- Allow vendors to insert their own products
CREATE POLICY "Vendors can insert their own products"
ON "Product" FOR INSERT
WITH CHECK (
  auth.uid()::text = (
    SELECT "vendorId" FROM "Store" WHERE id = "storeId"
  )
);
```

## Troubleshooting

### Connection Issues

- Verify your database password is correct
- Check that the connection string includes the correct region
- Ensure `?pgbouncer=true` is added to DATABASE_URL

### Prisma Issues

```bash
# Reset Prisma client
rm -rf node_modules/.prisma
npx prisma generate

# View your database
npx prisma studio
```

### Migration Issues

If you need to reset the database:

```bash
npx prisma db push --force-reset
```

⚠️ **Warning**: This will delete all data!

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Check your `.env` file configuration
3. Verify network connectivity to Supabase
4. Review Prisma error messages carefully
