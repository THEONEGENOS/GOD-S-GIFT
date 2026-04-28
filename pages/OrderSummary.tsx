import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaRegUserCircle,
  FaSignOutAlt,
  FaTint,
  FaTrashAlt,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa";
import sumImage from "../public/show.png";

type Order = {
  id: string;
  date: string;
  time: string;
  gallon_count: number;
  delivery_type: string;
  water_type: string;
  total_price?: number;
};

const OrderSummary: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderID, setOrderID] = useState("");
  const [email, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pricePerGallon = 15;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (storedUser?.email) {
      setUserEmail(storedUser.email);
    } else {
      alert("User not logged in. Redirecting to login page...");
      router.push("/Login");
    }
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!email) {
        return;
      }

      try {
        const response = await fetch(`/api/order?email=${email}`);
        const data = await response.json();

        if (!response.ok || !data.orders) {
          console.error("API returned an error:", data.error || "Unknown error");
          setOrders([]);
          setOrderID("");
          return;
        }

        const enrichedOrders = (data.orders || []).map((order: Order) => ({
          ...order,
          total_price: order.gallon_count * pricePerGallon,
        }));

        setOrders(enrichedOrders);
        setOrderID(enrichedOrders[0]?.id || "");
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setOrderID("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch("/api/order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });

      if (response.ok) {
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.filter((order) => order.id !== orderId);
          setOrderID(updatedOrders[0]?.id || "");
          return updatedOrders;
        });
      } else {
        console.error("Failed to delete order:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleBack = async () => {
    if (orderID) {
      await handleDeleteOrder(orderID);
    }

    router.push("/Order");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/Login");
  };

  const handleProceedToPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/Payments");
  };

  const totalOrders = orders.length;
  const totalGallons = orders.reduce((sum, order) => sum + order.gallon_count, 0);
  const grandTotal = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#082f49)]" />
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-5rem] h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-2">
              <Image
                src="/gods-gift-logo.png"
                alt="God's Gift Water Station logo"
                width={72}
                height={72}
                className="h-16 w-16 rounded-xl object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">Order Review</p>
              <h1 className="mt-2 text-xl font-semibold tracking-[0.14em] text-white sm:text-2xl">
                CHECK YOUR ORDER SUMMARY
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl sm:self-end">
            <button
              onClick={() => router.push("/Profile")}
              className="group inline-flex flex-1 items-center gap-3 rounded-2xl text-left transition hover:text-cyan-100"
              aria-label="Go to profile"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/30 text-cyan-200 transition group-hover:bg-slate-950/50">
                <FaRegUserCircle className="text-[1.75rem]" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Account
                </span>
                <span className="mt-1 block text-sm font-semibold text-white">Profile</span>
              </span>
            </button>

            <div className="h-10 w-px bg-white/10" />

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl px-1 text-sm font-semibold text-slate-200 transition hover:text-cyan-100"
            >
              <FaSignOutAlt className="text-sm" />
              Logout
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Review Before Payment
            </p>
            <h2 className="mt-6 max-w-[15ch] text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Confirm the details of your water order.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Double-check your schedule, order type, and total before proceeding to payment.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Orders</p>
                <p className="mt-3 text-lg font-semibold text-white">{totalOrders}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Gallons</p>
                <p className="mt-3 text-lg font-semibold text-white">{totalGallons}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Grand Total</p>
                <p className="mt-3 text-lg font-semibold text-white">PHP {grandTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10">
              <div className="relative h-[320px]">
                <Image src={sumImage} alt="Order Summary" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
                      <FaTint />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
                        Summary Status
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-7 text-slate-100">
                        Review your current order carefully before moving forward to payment confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Current Orders</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Order summary</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Here are the order details currently attached to your account.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-8 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300" />
                <p className="mt-4 text-sm text-slate-300">Loading your orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="mt-8 space-y-5">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5 transition hover:border-cyan-400/20"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-cyan-200" />
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date</p>
                              <p className="mt-1 font-semibold text-white">{order.date}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <FaClock className="text-cyan-200" />
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Time</p>
                              <p className="mt-1 font-semibold text-white">{order.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            {order.delivery_type === "delivery" ? (
                              <FaTruck className="text-cyan-200" />
                            ) : (
                              <FaWarehouse className="text-cyan-200" />
                            )}
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order Type</p>
                              <p className="mt-1 font-semibold capitalize text-white">{order.delivery_type}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-cyan-200" />
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Water Type</p>
                              <p className="mt-1 font-semibold text-white">{order.water_type}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Quantity</p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {order.gallon_count} gallon{order.gallon_count > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Total Price</p>
                          <p className="mt-1 text-2xl font-semibold text-white">
                            PHP {order.total_price?.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-200 transition hover:border-red-300/40 hover:bg-red-500/15 hover:text-white"
                        >
                          <FaTrashAlt className="text-xs" />
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-8 text-center">
                <p className="text-lg font-semibold text-white">No orders found.</p>
                <p className="mt-2 text-sm text-slate-400">Create a new order to continue to payment.</p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleBack}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
              >
                <FaArrowLeft className="text-xs" />
                Back to Order
              </button>

              <button
                onClick={handleProceedToPayment}
                disabled={orders.length === 0}
                className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Proceed to Payment
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
