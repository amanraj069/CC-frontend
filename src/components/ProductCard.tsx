"use client";

import React from "react";
import { Product } from "@/types";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price * 83); // Convert USD to INR approximately
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-200 overflow-hidden group">
      {/* Product Image */}
      <div className="aspect-square relative bg-gray-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="text-xl font-semibold text-gray-900 mb-4">
          {formatPrice(product.price)}
        </div>

        {/* Stock Status */}
        <div className="text-xs text-gray-500 mb-4">
          {product.stock > 0 ? (
            `${product.stock} available`
          ) : (
            <span className="text-red-500">Out of stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
