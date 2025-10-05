"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function CartPage() {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } =
    useCart();
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price * 83);
  };

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="mb-8">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Your Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Cart Items */}
        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <div key={item.productId} className="p-6">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0 w-20 h-20 relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="80px"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.price)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity - 1)
                    }
                    className="p-1 rounded-md hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 border border-gray-300 rounded-md text-center min-w-[3rem]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + 1)
                    }
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-lg font-semibold text-gray-900 min-w-[5rem] text-right">
                  {formatPrice(item.price * item.quantity)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 p-6">
          <div className="flex items-center justify-between text-lg font-semibold text-gray-900 mb-4">
            <span>
              Total ({cart.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
              items):
            </span>
            <span>{formatPrice(cart.totalAmount)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>

            {user ? (
              <Link
                href="/checkout"
                className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-900 rounded-lg text-base font-medium text-white bg-gray-900 hover:bg-gray-800"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <div className="flex-1 space-y-2">
                <Link
                  href="/login?redirect=/checkout"
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign in to Checkout
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Or{" "}
                  <Link
                    href="/register"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    create an account
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
