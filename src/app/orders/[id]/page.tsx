"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import {
  Package,
  Calendar,
  DollarSign,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  const fetchOrder = async () => {
    try {
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error: any) {
      console.error("Error fetching order:", error);
      if (error.response?.status === 404) {
        router.push("/orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (
      !order ||
      !window.confirm("Are you sure you want to cancel this order?")
    ) {
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(order._id);
      await fetchOrder(); // Refresh order data
      toast.success("Order cancelled successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to cancel order";
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price * 83);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Please sign in to view your order
        </h1>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Order not found
        </h1>
        <Link
          href="/orders"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-500 flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {(order.status === "pending" || order.status === "confirmed") && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="block mt-2 text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} each
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Address
            </h2>
            <div className="text-gray-600">
              <p>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Method
            </h2>
            <div className="text-gray-600">
              <p className="capitalize">
                {order.paymentMethod.replace("_", " ")}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  order.paymentStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                Payment {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Order Summary
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Subtotal (
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items)
              </span>
              <span className="text-gray-900">
                {formatPrice(order.totalAmount)}
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

            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Order Status
            </h3>
            <div className="space-y-2">
              {[
                { status: "pending", label: "Order Placed", completed: true },
                {
                  status: "confirmed",
                  label: "Order Confirmed",
                  completed: ["confirmed", "shipped", "delivered"].includes(
                    order.status
                  ),
                },
                {
                  status: "shipped",
                  label: "Shipped",
                  completed: ["shipped", "delivered"].includes(order.status),
                },
                {
                  status: "delivered",
                  label: "Delivered",
                  completed: order.status === "delivered",
                },
              ].map((step, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      step.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={
                      step.completed ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {step.label}
                  </span>
                </div>
              ))}

              {order.status === "cancelled" && (
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-3 bg-red-500" />
                  <span className="text-red-600">Order Cancelled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
