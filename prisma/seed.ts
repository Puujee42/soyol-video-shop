import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  // --- TECH (High Quality) ---
  {
    name: 'MacBook Air 15" M2 - Midnight',
    description: 'Impossibly thin and incredibly fast. Supercharged by M2 chip with a stunning Liquid Retina display.',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    price: 4499000,
    category: 'tech',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-02-05'),
  },
  {
    name: 'Sony WH-1000XM5 Noise Canceling',
    description: 'Industry-leading noise canceling headphones with 30-hour battery life and crystal clear hands-free calling.',
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&q=80',
    price: 1149000,
    category: 'tech',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-20'),
  },
  {
    name: 'Fujifilm X-T5 Mirrorless Camera',
    description: 'A photography-first camera with 40MP sensor and classic dial-based operation.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    price: 5899000,
    category: 'tech',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-15'),
  },
  {
    name: 'iPhone 15 Pro - Natural Titanium',
    description: 'The first iPhone with an aerospace-grade titanium design.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    price: 3999000,
    category: 'tech',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-02-10'),
  },
  {
    name: 'iPad Air 5 - Blue',
    description: 'Light. Bright. Full of might. Supercharged by the Apple M1 chip.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    price: 1899000,
    category: 'tech',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-12'),
  },

  // --- FASHION (Clean Studio Shots) ---
  {
    name: 'Nike Air Jordan 1 High OG',
    description: 'The one that started it all. Premium leather and iconic design.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    price: 589000,
    category: 'fashion',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-02-06'),
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket with a modern fit.',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
    price: 189000,
    category: 'fashion',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-05'),
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    description: 'Iconic aviator sunglasses with gold frame and green lenses.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    price: 459000,
    category: 'fashion',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-02-02'),
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Elegant timepiece with genuine leather strap.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    price: 289000,
    category: 'fashion',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-18'),
  },

  // --- HOME (Aesthetic Interiors) ---
  {
    name: 'Herman Miller Aeron Chair',
    description: 'The benchmark for ergonomic seating. Fully adjustable for personalized comfort.',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
    price: 4500000,
    category: 'home',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-30'),
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 white ceramic plant pots with wooden stands.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    price: 45000,
    category: 'home',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-02-04'),
  },
  {
    name: 'Pour-Over Coffee Set',
    description: 'Complete kit for brewing the perfect cup of coffee. Includes dripper, server, and kettle.',
    image: 'https://images.unsplash.com/photo-1544062551-6453974f7568?w=800&q=80',
    price: 220000,
    category: 'home',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-02-01'),
  },
  {
    name: 'Modern Desk Lamp',
    description: 'Adjustable LED desk lamp with wireless charging base.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    price: 89000,
    category: 'home',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-25'),
  },

  // --- BEAUTY (Clean Product Shots) ---
  {
    name: 'Aesop Resurrection Hand Balm',
    description: 'A blend of fragrant botanicals and skin-softening emollients.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    price: 125000,
    category: 'beauty',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-02-06'),
  },
  {
    name: 'Luxury Skincare Set',
    description: 'Complete daily skincare routine for glowing skin.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    price: 249000,
    category: 'beauty',
    stockStatus: 'in-stock',
    createdAt: new Date('2024-01-15'),
  },

  // --- PRE-ORDER (High Ticket Items) ---
  {
    name: 'Apple Vision Pro',
    description: 'Welcome to the era of spatial computing. Seamlessly blends digital content with your physical space.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?w=800&q=80',
    price: 12999000,
    category: 'tech',
    stockStatus: 'pre-order',
    createdAt: new Date('2024-02-07'),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Epic design with titanium frame and Corning Gorilla Armor.',
    image: 'https://images.unsplash.com/photo-1610945265078-38584e2690e0?w=800&q=80',
    price: 4599000,
    category: 'tech',
    stockStatus: 'pre-order',
    createdAt: new Date('2024-02-05'),
  },
  {
    name: 'DJI Mavic 3 Pro',
    description: 'Triple-camera flagship drone with 4/3 CMOS Hasselblad camera.',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80',
    price: 5499000,
    category: 'tech',
    stockStatus: 'pre-order',
    createdAt: new Date('2024-02-01'),
  },
  {
    name: 'Louis Vuitton Keepall Bandoulière',
    description: 'Iconic monogram canvas travel bag. Timeless elegance.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    price: 8900000,
    category: 'fashion',
    stockStatus: 'pre-order',
    createdAt: new Date('2024-02-03'),
  },
  {
    name: 'La Marzocco Linea Mini',
    description: 'Kitchen-sized version of the Linea Classic. Professional grade espresso.',
    image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800&q=80',
    price: 12500000,
    category: 'home',
    stockStatus: 'pre-order',
    createdAt: new Date('2024-02-04'),
  },
  {
    name: 'PlayStation 5 Pro',
    description: 'The most powerful PlayStation ever built. 8K gaming ready.',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    price: 2100000,
    category: 'gaming',
    stockStatus: 'pre-order',
    createdAt: new Date('2024-02-07'),
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing products
    await prisma.product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create products
    for (const product of sampleProducts) {
      await prisma.product.create({
        data: product,
      });
    }

    console.log(`✅ Successfully seeded ${sampleProducts.length} products`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });