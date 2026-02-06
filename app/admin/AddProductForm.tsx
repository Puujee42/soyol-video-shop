'use client';

import { useState } from 'react';
import { createProduct } from '@/app/actions/products';
import { Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

export default function AddProductForm({ categories }: { categories: Category[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    try {
      const result = await createProduct(formData);
      
      if (result.success) {
        toast.success(result.message, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
          },
          icon: '✅',
        });
        
        // Reset form
        (document.getElementById('add-product-form') as HTMLFormElement)?.reset();
      } else {
        toast.error(result.message, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
          },
          icon: '❌',
        });
      }
    } catch (error) {
      toast.error('Алдаа гарлаа', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      id="add-product-form"
      action={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Product Name */}
      <div className="md:col-span-2">
        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
          Барааны нэр *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-soyol focus:border-transparent font-medium"
          placeholder="Жишээ: Sony A7 IV Camera"
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">
          Үнэ (₮) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          required
          step="1000"
          min="0"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-soyol focus:border-transparent font-medium"
          placeholder="4890000"
        />
      </div>

      {/* Rating */}
      <div>
        <label htmlFor="rating" className="block text-sm font-bold text-gray-700 mb-2">
          Үнэлгээ (1-5)
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          step="0.1"
          min="1"
          max="5"
          defaultValue="4.5"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-soyol focus:border-transparent font-medium"
          placeholder="4.5"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700 mb-2">
          Ангилал *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-soyol focus:border-transparent font-medium"
        >
          <option value="">Ангилал сонгох...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-bold text-gray-700 mb-2">
          Зургийн URL *
        </label>
        <input
          type="url"
          id="image"
          name="image"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-soyol focus:border-transparent font-medium"
          placeholder="https://example.com/image.jpg"
          defaultValue="https://picsum.photos/seed/default/440/420"
        />
      </div>

      {/* Checkboxes */}
      <div className="md:col-span-2 flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            className="w-5 h-5 rounded border-gray-300 text-soyol focus:ring-soyol"
          />
          <span className="text-sm font-bold text-gray-700">Онцлох бараа</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="wholesale"
            className="w-5 h-5 rounded border-gray-300 text-soyol focus:ring-soyol"
          />
          <span className="text-sm font-bold text-gray-700">Бөөний үнэ</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3 bg-soyol text-white font-bold rounded-xl shadow-lg hover:bg-soyol/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Нэмж байна...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Бараа нэмэх</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
