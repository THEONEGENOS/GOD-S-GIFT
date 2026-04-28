import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Order = {
  id: string;
  date: string;
  gallon_count: number;
  total_price: number;
  water_type: string;
  email: string;
};

const pricePerGallon = 15;

const formatDate = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);

const History: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (storedUser?.email) {
      setEmail(storedUser.email);
      return;
    }

    alert("User not logged in. Redirecting to login page...");
    router.push("/Login");
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!email) return;

      try {
        const response = await fetch(`/api/order?email=${email}`);
        const data = await response.json();

        if (!response.ok || !data.orders) {
          console.error("API returned an error:", data.error || "Unknown error");
          setOrders([]);
          return;
        }

        const enrichedOrders = (data.orders || []).map((order: Order) => ({
          ...order,
          total_price: order.gallon_count * pricePerGallon,
        }));

        setOrders(enrichedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [email]);

  const totalOrders = orders.length;
  const totalGallons = orders.reduce((sum, order) => sum + order.gallon_count, 0);
  const totalSpent = orders.reduce((sum, order) => sum + order.total_price, 0);
  const latestOrder = orders[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#082f49)]" />
      <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-[-6rem] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Customer Portal
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Purchase History
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Review your recent water orders, monitor total usage, and keep track of your spending in one clean dashboard.
            </p>
          </div>

          <button
            onClick={() => router.push("/Done")}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
          >
            Back
          </button>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Account Overview
            </p>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Signed in as</p>
                <p className="mt-1 break-all text-lg font-medium text-white">{email || "Loading..."}</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Latest Order</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {latestOrder ? formatDate(latestOrder.date) : "No orders yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Orders</p>
              <p className="mt-3 text-3xl font-semibold text-white">{totalOrders}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Gallons</p>
              <p className="mt-3 text-3xl font-semibold text-white">{totalGallons}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Spent</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/65 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Order Records</h2>
              <p className="mt-1 text-sm text-slate-400">
                A complete summary of your previous purchases.
              </p>
            </div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              {totalOrders} {totalOrders === 1 ? "entry" : "entries"}
            </div>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Water Type
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Order Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`transition hover:bg-white/5 ${
                        index !== orders.length - 1 ? "border-b border-white/5" : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                            {order.water_type.slice(0, 1).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-medium text-white">{order.water_type}</p>
                            <p className="text-sm text-slate-400">Water delivery</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-300">{formatDate(order.date)}</td>
                      <td className="px-6 py-5 text-sm text-slate-300">{order.gallon_count} gallons</td>
                      <td className="px-6 py-5 text-sm font-semibold text-white">
                        {formatCurrency(order.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-200">
                H
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">No order history yet</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Once you place your first order, your records will appear here with quantity, date, and total cost.
              </p>
              <button
                onClick={() => router.push("/Order")}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Create New Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
