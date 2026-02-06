import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Cleared existing data');

  // Create Categories
  const techCategory = await prisma.category.create({
    data: {
      name: 'Электрон бараа',
      icon: '📱',
    },
  });

  const homeCategory = await prisma.category.create({
    data: {
      name: 'Гэр ахуй',
      icon: '🏠',
    },
  });

  const fashionCategory = await prisma.category.create({
    data: {
      name: 'Хувцас',
      icon: '👔',
    },
  });

  const gadgetsCategory = await prisma.category.create({
    data: {
      name: 'Гаджет',
      icon: '⚡',
    },
  });

  const beautyCategory = await prisma.category.create({
    data: {
      name: 'Гоо сайхан',
      icon: '💄',
    },
  });

  console.log('✅ Created categories');

  // Create Products
  const products = [
    // Electronics - In Stock
    {
      name: 'Өндөр чанарын Bluetooth чихэвч',
      description: 'Дуу чанар өндөр, шуугиан багасгагч технологитой. Нэг удаа цэнэглэхэд 30 цаг ажиллана. IPX7 усан тэсвэртэй.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      price: 189000,
      rating: 4.8,
      stockStatus: 'in-stock',
      categoryId: techCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Ухаалаг утасны дэлгэц хамгаалагч',
      description: 'Зураас тэсвэртэй 9H хатуулгатай. Хялбархан суурилуулах боломжтой. Бүх iPhone загваруудад тохирно.',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
      price: 25000,
      rating: 4.6,
      stockStatus: 'in-stock',
      categoryId: techCategory.id,
      featured: false,
      wholesale: true,
    },
    {
      name: 'USB-C цэнэглэгч кабель (3м)',
      description: 'Хурдан цэнэглэх технологи. 100W power delivery дэмждэг. Уян хатан, бат бөх материалаар хийгдсэн.',
      image: 'https://images.unsplash.com/photo-1591290619762-c588f0c1b5f1?w=800&q=80',
      price: 15000,
      rating: 4.7,
      stockStatus: 'in-stock',
      categoryId: techCategory.id,
      featured: false,
      wholesale: true,
    },
    {
      name: 'Wireless гар + хулгана',
      description: 'Эрчим хүч хэмнэлттэй дизайн. Нэг батерейгаар 18 сар ажиллана. Эргономик загвар, тогтвортой холболт.',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
      price: 89000,
      rating: 4.5,
      stockStatus: 'in-stock',
      categoryId: techCategory.id,
      featured: true,
      wholesale: false,
    },

    // Electronics - Pre-order
    {
      name: 'Apple AirPods Pro 2',
      description: 'Active noise cancellation, сайжруулсан дуу чанар. 6 цаг ажиллах хугацаатай. MagSafe цэнэглэгчтэй.',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&q=80',
      price: 890000,
      rating: 4.9,
      stockStatus: 'pre-order',
      categoryId: techCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: '4K веб камер',
      description: 'Өндөр нарийвчлалтай 4K 30fps бичлэг. Автомат фокус, сайжруулсан гэрэлтүүлэг. Zoom/Teams-тэй нийцтэй.',
      image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=800&q=80',
      price: 185000,
      rating: 4.7,
      stockStatus: 'pre-order',
      categoryId: techCategory.id,
      featured: false,
      wholesale: false,
    },
    {
      name: 'Gaming механик гар',
      description: 'RGB LED гэрэлтүүлэг. Mechanical switch бүхий. Programmable товчлуурууд. Anti-ghosting технологи.',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
      price: 245000,
      rating: 4.8,
      stockStatus: 'pre-order',
      categoryId: techCategory.id,
      featured: true,
      wholesale: false,
    },

    // Home Decor - In Stock
    {
      name: 'LED үдшийн гэрэл',
      description: 'Зөөлөн, сэтгэл тайван гэрэлтүүлэг. 3 түвшин өнгөний тохиргоотой. Энерги хэмнэлттэй LED технологи.',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
      price: 45000,
      rating: 4.6,
      stockStatus: 'in-stock',
      categoryId: homeCategory.id,
      featured: false,
      wholesale: true,
    },
    {
      name: 'Модон шал цэвэрлэгч робот',
      description: 'Ухаалаг навигаци систем. Саад тотгорыг тойрч гардаг. Автомат цэнэглэгч станц бүхий. Эдлэн хэмнэлттэй.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      price: 450000,
      rating: 4.7,
      stockStatus: 'in-stock',
      categoryId: homeCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Гоо сайхны толь LED гэрэлтэй',
      description: 'Тодорхой харагдах LED гэрэлтүүлэг. 360° эргэдэг. Тохируулагдах гэрлийн зэрэглэл. Үнэхээр тод толь.',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
      price: 125000,
      rating: 4.8,
      stockStatus: 'in-stock',
      categoryId: homeCategory.id,
      featured: false,
      wholesale: false,
    },
    {
      name: 'Цэцэгний өрөөний чимэглэл',
      description: 'Байгалийн ургамал мэт харагдах хиймэл цэцэг. Арчилгаа шаарддаггүй. Өрөөний сэтгэл ханамжийг нэмэгдүүлнэ.',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
      price: 35000,
      rating: 4.5,
      stockStatus: 'in-stock',
      categoryId: homeCategory.id,
      featured: false,
      wholesale: true,
    },

    // Home Decor - Pre-order
    {
      name: 'Умард загварын модон ширээ',
      description: 'Өндөр чанарын мод материал. Минималист дизайн. Тогтвортой, бат бөх. 4-6 хүний хооллох ширээ.',
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
      price: 680000,
      rating: 4.9,
      stockStatus: 'pre-order',
      categoryId: homeCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Минималист хананы цаг',
      description: 'Орчин үеийн загвар. Чимээгүй механизм. Гоё харагдах скандинав дизайн. Аль ч өрөөнд тохирно.',
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80',
      price: 55000,
      rating: 4.6,
      stockStatus: 'pre-order',
      categoryId: homeCategory.id,
      featured: false,
      wholesale: false,
    },

    // Fashion - In Stock
    {
      name: 'Ариун цэвэр хөвөн цамц',
      description: '100% organic хөвөн материал. Өнгө сулрахгүй. Амьсгалдаг даавуу. Өдөр тутмын хэрэгцээнд тохиромжтой.',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      price: 45000,
      rating: 4.7,
      stockStatus: 'in-stock',
      categoryId: fashionCategory.id,
      featured: false,
      wholesale: true,
    },
    {
      name: 'Спорт гутал (Nike загвар)',
      description: 'Амьсгалах материал, сайн дэмжлэг. Гүйлт, спортод тохиромжтой. Гулдмайтай биш, бат бөх. Өнгө сонголттой.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      price: 145000,
      rating: 4.8,
      stockStatus: 'in-stock',
      categoryId: fashionCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Өвлийн халуун малгай',
      description: 'Зөөлөн ноосон материал. Чих хамгаалагч бүхий. Хүйтэн өвлийн өдөрт тохиромжтой. Загвар сонголттой.',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80',
      price: 35000,
      rating: 4.5,
      stockStatus: 'in-stock',
      categoryId: fashionCategory.id,
      featured: false,
      wholesale: true,
    },
    {
      name: 'Бизнес ажлын цүнх',
      description: 'Өндөр чанарын арьс материал. Laptop, баримт бичиг хийх орон зай. Мэргэжлийн, сайхан дизайн.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      price: 95000,
      rating: 4.6,
      stockStatus: 'in-stock',
      categoryId: fashionCategory.id,
      featured: false,
      wholesale: false,
    },

    // Fashion - Pre-order
    {
      name: 'Премиум арьсан бүс',
      description: 'Жинхэнэ арьс материал. Автомат түгжээ. Зураас үүсэхгүй. Бизнес, casual өмсгөлд тохирно.',
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583aa?w=800&q=80',
      price: 85000,
      rating: 4.8,
      stockStatus: 'pre-order',
      categoryId: fashionCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Designer нүдний шил',
      description: 'UV хамгаалалттай поляризэйшн шил. Хөнгөн жин. Премиум загвар. Хайрцаг, бүрээстэй хамт.',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      price: 125000,
      rating: 4.9,
      stockStatus: 'pre-order',
      categoryId: fashionCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Casual жинсэн өмд',
      description: 'Уян хатан тухтай эдлэл. Орчин үеийн slim fit загвар. Өнгө сулрахгүй. Бүх улирлын өмсгөл.',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      price: 75000,
      rating: 4.6,
      stockStatus: 'pre-order',
      categoryId: fashionCategory.id,
      featured: false,
      wholesale: false,
    },

    // Gadgets - In Stock
    {
      name: 'Portable цэнэглэгч 20000mAh',
      description: 'Өндөр багтаамжтай хурдан цэнэглэгч. 2 утсыг зэрэг цэнэглэх боломжтой. Хөнгөн жингийн дизайн. LED индикатор.',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
      price: 55000,
      rating: 4.7,
      stockStatus: 'in-stock',
      categoryId: gadgetsCategory.id,
      featured: false,
      wholesale: true,
    },
    {
      name: 'Ухаалаг утасны зогсоол',
      description: 'Тохируулагдах өнцөг. Ширээ, ор дээр тохирно. Бат бөх тулгуур. Бүх утасны загвартай тохирно.',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
      price: 25000,
      rating: 4.5,
      stockStatus: 'in-stock',
      categoryId: gadgetsCategory.id,
      featured: false,
      wholesale: true,
    },
    {
      name: 'Bluetooth speaker усан тэсвэртэй',
      description: 'IPX7 усан тэсвэр. Өндөр чанарын дуу чимээ. 12 цаг тасралтгүй ажиллана. Гадна, усан үзэсгэлэнд тохиромжтой.',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      price: 85000,
      rating: 4.8,
      stockStatus: 'in-stock',
      categoryId: gadgetsCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'USB зууван хэлбэртэй',
      description: '64GB багтаамжтай. Хурдан шилжүүлэг. Эдлэн хэмнэлттэй дизайн. Эдэлгээ бүхий түлхүүртэй.',
      image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80',
      price: 18000,
      rating: 4.4,
      stockStatus: 'in-stock',
      categoryId: gadgetsCategory.id,
      featured: false,
      wholesale: true,
    },

    // Gadgets - Pre-order
    {
      name: 'Ухаалаг цаг Apple Watch загвар',
      description: 'Хүч дадлын хяналт. Зүрхний цохилт хэмжигч. GPS, усан тэсвэр. 24 цаг ажиллах хугацаа. Өөрчлөгдөх tuuzтай.',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
      price: 385000,
      rating: 4.9,
      stockStatus: 'pre-order',
      categoryId: gadgetsCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Mini drone камертай',
      description: '4K HD камер. 30 минут нисэх хугацаа. Хялбар удирдлага. Гэрэл зургийн автомат горим. Эхлэгчдэд тохиромжтой.',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
      price: 285000,
      rating: 4.7,
      stockStatus: 'pre-order',
      categoryId: gadgetsCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'VR гарын бээлий',
      description: 'Virtual reality тоглоомд зориулсан. Motion tracking. Haptic feedback. PlayStation VR-тэй нийцтэй.',
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
      price: 195000,
      rating: 4.6,
      stockStatus: 'pre-order',
      categoryId: gadgetsCategory.id,
      featured: false,
      wholesale: false,
    },

    // Beauty - In Stock
    {
      name: 'Гоо сайхны хүчилтөрөгчийн аппарат',
      description: 'Арьсны гүн цэвэрлэгээ. Хар толгой, хог хаягдал зайлуулна. Гэрээсээ салон үйлчилгээ. Аюулгүй, үр дүнтэй.',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
      price: 145000,
      rating: 4.7,
      stockStatus: 'in-stock',
      categoryId: beautyCategory.id,
      featured: false,
      wholesale: false,
    },
    {
      name: 'Арьс арчлах багц (10 ширхэг)',
      description: 'Олон улсын брэндийн бүтээгдэхүүн. Чийгшүүлэх, цэвэрлэх, тэжээх. Бүх арьсны төрөлд тохирно. Баталгаатай жинхэнэ.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
      price: 85000,
      rating: 4.8,
      stockStatus: 'in-stock',
      categoryId: beautyCategory.id,
      featured: true,
      wholesale: true,
    },
    {
      name: 'LED арьс арчлах хэрэгсэл',
      description: 'Улаан, нил, ногоон гэрэл технологи. Үрчлээс сэргийлнэ. Арьс залуужуулах. Өдөр тутам 10 минут ашиглана.',
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
      price: 125000,
      rating: 4.6,
      stockStatus: 'in-stock',
      categoryId: beautyCategory.id,
      featured: false,
      wholesale: false,
    },

    // Beauty - Pre-order
    {
      name: 'Корей маск багц (50 ширхэг)',
      description: 'Premium корейн нүүрний маск. Янз бүрийн төрөл (Hyaluronic, Vitamin C, Collagen). Зөөлөн даавуутай. Хурдан үр дүн.',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
      price: 95000,
      rating: 4.9,
      stockStatus: 'pre-order',
      categoryId: beautyCategory.id,
      featured: true,
      wholesale: false,
    },
    {
      name: 'Хөмсөг засах комплект',
      description: 'Бүрэн иж бүрдэл. Пинцет, шанз, шаблон, чийгшүүлэгч. Мэргэжлийн түвшин. Хялбар ашиглах. Аялалд тохиромжтой.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
      price: 45000,
      rating: 4.5,
      stockStatus: 'pre-order',
      categoryId: beautyCategory.id,
      featured: false,
      wholesale: false,
    },
  ];

  // Bulk create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);

  // Create sample admin user
  await prisma.user.create({
    data: {
      email: 'admin@soyol.mn',
      name: 'Admin User',
      role: 'admin',
      password: 'admin123', // In production, this should be hashed
    },
  });

  console.log('✅ Created admin user');

  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();

  console.log('\n🎉 Seed completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${totalCategories} categories`);
  console.log(`   - ${totalProducts} products`);
  console.log(`   - 1 admin user (admin@soyol.mn / admin123)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
