'use client';

import { useState } from 'react';
import { deleteProduct } from '@/app/actions/products';
import { Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    // Confirm before deleting
    const confirmed = window.confirm(
      `"${productName}" барааг устгахдаа итгэлтэй байна уу?`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteProduct(productId);

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
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Устгаж байна...</span>
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Устгах</span>
        </>
      )}
    </button>
  );
}
