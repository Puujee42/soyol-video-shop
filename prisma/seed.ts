import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Cleared existing data');

  // Create categories with subcategories
  const cameraCategory = await prisma.category.create({
    data: {
      id: 'camera',
      name: 'Видео Камер',
      icon: '📹',
      subcategories: {
        create: [
          { id: 'dslr', name: 'DSLR Камер' },
          { id: 'mirrorless', name: 'Mirrorless Камер' },
          { id: 'action', name: 'Action Камер' },
        ],
      },
    },
  });

  const lightingCategory = await prisma.category.create({
    data: {
      id: 'lighting',
      name: 'Гэрэлтүүлэг',
      icon: '💡',
      subcategories: {
        create: [
          { id: 'studio', name: 'Студийн гэрэл' },
          { id: 'led', name: 'LED гэрэл' },
          { id: 'ring', name: 'Ring Light' },
        ],
      },
    },
  });

  const audioCategory = await prisma.category.create({
    data: {
      id: 'audio',
      name: 'Дуу бичлэг',
      icon: '🎤',
      subcategories: {
        create: [
          { id: 'microphone', name: 'Микрофон' },
          { id: 'mixer', name: 'Mixer' },
          { id: 'recorder', name: 'Recorder' },
        ],
      },
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      id: 'accessories',
      name: 'Дагалдах хэрэгсэл',
      icon: '🎒',
      subcategories: {
        create: [
          { id: 'tripod', name: 'Tripod' },
          { id: 'bag', name: 'Камерын цүнх' },
          { id: 'memory', name: 'Memory Card' },
        ],
      },
    },
  });

  console.log('✅ Created categories');

  // Create products
  const products = [
    // Video Cameras
    { name: 'Sony A7 IV Mirrorless Camera Body', price: 4890000, categoryId: 'camera', featured: true, wholesale: true },
    { name: 'Canon EOS R6 Mark II + RF 24-105mm', price: 5250000, categoryId: 'camera', featured: true, wholesale: false },
    { name: 'Panasonic Lumix GH6 4K 120fps', price: 3890000, categoryId: 'camera', featured: false, wholesale: true },
    { name: 'GoPro Hero 12 Black Waterproof', price: 890000, categoryId: 'camera', featured: false, wholesale: false },
    
    // Lighting Equipment
    { name: 'Godox SL-60W LED Video Light', price: 320000, categoryId: 'lighting', featured: true, wholesale: true },
    { name: 'Aputure 300d Mark II COB Light', price: 1890000, categoryId: 'lighting', featured: false, wholesale: false },
    { name: 'Neewer 18" Ring Light RGB', price: 180000, categoryId: 'lighting', featured: false, wholesale: true },
    { name: 'Godox LC500R RGB LED Stick', price: 450000, categoryId: 'lighting', featured: true, wholesale: false },
    
    // Audio Recording
    { name: 'Rode Wireless GO II Microphone', price: 590000, categoryId: 'audio', featured: true, wholesale: true },
    { name: 'Shure SM7B Studio Mic', price: 820000, categoryId: 'audio', featured: false, wholesale: false },
    { name: 'Zoom H6 All Black Recorder', price: 680000, categoryId: 'audio', featured: false, wholesale: true },
    { name: 'Behringer X32 Digital Mixer', price: 2890000, categoryId: 'audio', featured: true, wholesale: false },
    
    // Accessories
    { name: 'Manfrotto Carbon Fiber Tripod', price: 450000, categoryId: 'accessories', featured: false, wholesale: true },
    { name: 'Peak Design Everyday Backpack 30L', price: 380000, categoryId: 'accessories', featured: true, wholesale: false },
    { name: 'SanDisk Extreme PRO 128GB V90', price: 120000, categoryId: 'accessories', featured: false, wholesale: true },
    { name: 'DJI Ronin RS3 Pro Gimbal', price: 1250000, categoryId: 'accessories', featured: true, wholesale: false },
  ];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    await prisma.product.create({
      data: {
        name: product.name,
        image: `https://picsum.photos/seed/soyol${i}/440/420`,
        price: product.price,
        rating: +(Math.random() * 1 + 4).toFixed(1),
        categoryId: product.categoryId,
        featured: product.featured,
        wholesale: product.wholesale,
      },
    });
  }

  console.log('✅ Created products');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
