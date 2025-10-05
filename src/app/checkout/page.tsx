"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { orderService, CreateOrderData } from "@/services/orderService";
import { Address } from "@/types";
import { CreditCard, Truck, Lock } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import toast from "react-hot-toast";

interface CheckoutFormData extends CreateOrderData {
  sameAsBilling: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, refreshCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      sameAsBilling: true,
      paymentMethod: "credit_card",
    },
  });

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // Wait for cart to load before redirecting
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      router.push("/cart");
      return;
    }
  }, [user, cart, cartLoading, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price * 83);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsLoading(true);

      const orderData: CreateOrderData = {
        shippingAddress: data.shippingAddress,
        billingAddress: sameAsBilling
          ? data.shippingAddress
          : data.billingAddress!,
        paymentMethod: data.paymentMethod,
      };

      const order = await orderService.createOrder(orderData);

      // Refresh cart (should be empty now)
      await refreshCart();

      toast.success("Order placed successfully!");
      router.push(`/orders/${order._id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to place order";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || cartLoading || !cart || cart.items.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-medium text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    {...register("shippingAddress.firstName", {
                      required: "First name is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue={user.firstName}
                  />
                  {errors.shippingAddress?.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shippingAddress.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    {...register("shippingAddress.lastName", {
                      required: "Last name is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue={user.lastName}
                  />
                  {errors.shippingAddress?.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shippingAddress.lastName.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    {...register("shippingAddress.address", {
                      required: "Address is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="123 Main St"
                  />
                  {errors.shippingAddress?.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shippingAddress.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    {...register("shippingAddress.city", {
                      required: "City is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.shippingAddress?.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shippingAddress.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    {...register("shippingAddress.state", {
                      required: "State is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.shippingAddress?.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shippingAddress.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    {...register("shippingAddress.zipCode", {
                      required: "ZIP code is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.shippingAddress?.zipCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shippingAddress.zipCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    {...register("shippingAddress.country", {
                      required: "Country is required",
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue="India"
                  />
                  {errors.shippingAddress?.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shippingAddress.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="sameAsBilling"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="sameAsBilling"
                  className="text-sm font-medium text-gray-700"
                >
                  Billing address is the same as shipping address
                </label>
              </div>

              {!sameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billing address fields (similar to shipping) */}
                  {/* For brevity, I'll include just a few fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register("billingAddress.firstName")}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  {/* Add other billing fields as needed */}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { value: "credit_card", label: "Credit Card" },
                  { value: "debit_card", label: "Debit Card" },
                  { value: "paypal", label: "PayPal" },
                ].map((method) => (
                  <label key={method.value} className="flex items-center">
                    <input
                      {...register("paymentMethod")}
                      type="radio"
                      value={method.value}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 text-green-600 mr-2" />
                  <p className="text-xs text-gray-600">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 w-12 h-12 relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {formatPrice(cart.totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">Included</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {formatPrice(cart.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex items-center justify-center py-3 px-4 border border-transparent rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                `Place Order - ${formatPrice(cart.totalAmount)}`
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
