# 🛍️ Soyol Video Shop

Amazon болон Shoppy.mn шиг мэргэжлийн түвшний E-commerce платформ.

## ✨ Онцлох Функцууд

### 🎯 Ажиллагаа
- ✅ **Бүрэн ажиллагаатай Category Filter** - "Бүгд", "Өнөөдөр", "Шинэ", "Хямдрал" товчлууруудыг дарахад бараануд Framer Motion-оор зөөлөн шүүгдэнэ
- ✅ **Real-time Search** - Хайлт дээр үсэг бичихэд зөв үр дүнгүүд (зураг, нэр, үнэ) цэвэрхэн dropdown-оор гарч ирнэ
- ✅ **Сагс (Shopping Cart)** - Zustand + LocalStorage ашигласан. Refresh хийхэд мэдээлэл алдагдахгүй
- ✅ **Add to Cart Animation** - Сагс дээрх тоо анимацитайгаар нэмэгдэж, улбар шар "Success" toast мэдэгдэл гарна
- ✅ **Product Detail Page** - Бараа бүр дээр дарахад `/product/[id]` хуудас руу үсрэх

### 🎨 Дизайн
- 🟠 **Soyol Orange (#FF7900)** - Үндсэн брэнд өнгө
- 🌈 **EventX Style Gradients** - Ягаан-хөх градиентууд banner дээр
- ✨ **Framer Motion Animations** - Hover, tap, filter transitions
- 📱 **Mobile Responsive** - Утсан дээр EventX апп шиг тохижилттой

### 🏗️ Технологи
- ⚡ **Next.js 15 (App Router)** - Server-side Rendering, ISR
- 🎨 **Tailwind CSS** - Custom theme with orange/gradient colors
- 📘 **TypeScript** - Type safety
- 🎭 **Framer Motion** - Smooth animations
- 🗄️ **Zustand** - Global state management
- 🍞 **React Hot Toast** - Beautiful notifications
- 🎣 **SWR** - Data caching and revalidation

## 🚀 Эхлэх

### 1️⃣ Dependencies суулгах

\`\`\`bash
npm install
\`\`\`

### 2️⃣ Development Server эхлүүлэх

**⚠️ ЧУХАЛ:** Хэрэв EPERM алдаа гарвал:

1. **Windows Defender-ыг түр унтраах:**
   - Windows Security хэсэгт ороод
   - "Virus & threat protection" дээр дараад
   - "Real-time protection"-ыг түр унтрааарай

2. **Эсвэл Antivirus-ийн exclusion нэм:**
   - `C:\Users\User\Desktop\amazon\node_modules` хавтсыг антивирусын exception list-д нэм

3. **Дараа нь terminal дээр:**

\`\`\`bash
npm run dev
\`\`\`

4. **Браузераа нээгээд энэ хаягаар ороорой:**

\`\`\`
http://localhost:3000
\`\`\`

## 📂 Файлын Бүтэц

\`\`\`
amazon/
├── app/
│   ├── layout.tsx          # Root layout with Navbar, Footer, Toast
│   ├── globals.css         # Global styles, animations, gradients
│   ├── page.tsx            # Homepage with Filter + Product Grid
│   └── product/
│       └── [id]/
│           └── page.tsx    # Dynamic product detail page
├── components/
│   ├── Navbar.tsx          # Search, Cart, User navigation
│   ├── SearchDropdown.tsx  # Real-time search results
│   ├── BannerSlider.tsx    # Hero slider with gradients
│   ├── FilterBar.tsx       # Category filter buttons
│   ├── ProductGrid.tsx     # Product list with filtering
│   ├── ProductCard.tsx     # Individual product card
│   └── SkeletonCard.tsx    # Loading placeholder
├── lib/
│   ├── data.ts             # Mock products and categories
│   ├── hooks/
│   │   └── useProducts.ts  # SWR data fetching hook
│   └── store/
│       └── cartStore.ts    # Zustand cart state management
├── models/
│   ├── Product.ts          # Product TypeScript interface
│   └── Category.ts         # Category TypeScript interface
├── next.config.js          # Next.js config for remote images
├── tailwind.config.ts      # Custom Tailwind theme
└── package.json            # Project dependencies

\`\`\`

## 🛠️ Тохиргоо

### Өнгө солих

\`tailwind.config.ts\` файлд:

\`\`\`typescript
colors: {
  soyol: '#FF7900',  // Үндсэн улбар шар
  // ... бусад өнгө
}
\`\`\`

### Бараа нэмэх

\`lib/data.ts\` файлд:

\`\`\`typescript
const productNames = [
  'Шинэ бараа 1',
  'Шинэ бараа 2',
  // ...
];
\`\`\`

## 🌟 Үзүүлэх Төсөл

1. Бүгдийг "Accept" эсвэл "Apply" хийгээрэй
2. Terminal дээр `npm install` дараа `npm run dev` ажиллуулаарай
3. `http://localhost:3000` руу ороод үр дүнгээ харж таашаал аваарай!

---

**Хөгжүүлсэн:** Gemini 2.0 Flash + Claude 3.7 Sonnet  
**Он:** 2026  
**Лиценз:** MIT
