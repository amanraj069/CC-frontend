"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Order } from "@/types";

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login");
      return;
    }

    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      // For now, using mock data until we implement getAllOrders API
      const mockOrders: Order[] = [
        {
          _id: "order1",
          userId: "user1",
          orderNumber: "ORD-20241005-001",
          items: [
            {
              productId: "prod1",
              name: "Smart Fitness Watch",
              price: 299.99,
              quantity: 1,
              imageUrl:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            },
          ],
          totalAmount: 299.99,
          status: "pending",
          shippingAddress: {
            firstName: "John",
            lastName: "Doe",
            address: "123 Main St",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
          },
          billingAddress: {
            firstName: "John",
            lastName: "Doe",
            address: "123 Main St",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
          },
          paymentMethod: "credit_card",
          paymentStatus: "completed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "order2",
          userId: "user2",
          orderNumber: "ORD-20241005-002",
          items: [
            {
              productId: "prod2",
              name: "Wireless Earbuds",
              price: 79.99,
              quantity: 2,
              imageUrl:
                "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500",
            },
          ],
          totalAmount: 159.98,
          status: "confirmed",
          shippingAddress: {
            firstName: "Jane",
            lastName: "Smith",
            address: "456 Park Ave",
            city: "Delhi",
            state: "Delhi",
            zipCode: "110001",
            country: "India",
          },
          billingAddress: {
            firstName: "Jane",
            lastName: "Smith",
            address: "456 Park Ave",
            city: "Delhi",
            state: "Delhi",
            zipCode: "110001",
            country: "India",
          },
          paymentMethod: "paypal",
          paymentStatus: "completed",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price * 83);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.status === filter
  );

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== "admin") {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Order Management
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage all customer orders
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-1 mb-6 inline-flex">
        {[
          { key: "all", label: "All Orders" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "shipped", label: "Shipped" },
          { key: "delivered", label: "Delivered" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === tab.key
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "No orders have been placed yet."
                : `No ${filter} orders found.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>
                  </div>
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
