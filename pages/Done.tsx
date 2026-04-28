import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaArrowRight, FaCheckCircle, FaHistory, FaTint } from "react-icons/fa";
import drinkwaterImage from "../public/drink-water.png";
import wallclockImage from "../public/wall-clock.png";
import waterdropImage from "../public/water-drop.png";

type Order = {
  id: string;
  date: string;
  time: string;
  gallon_count: number;
  total_price: number | string;
  water_type: string;
  email: string;
};

const toCurrencyNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const formatTime = (value: string) => {
  if (!value) {
    return value;
  }

  const direct = new Date(`1970-01-01T${value}`);

  if (!Number.isNaN(direct.getTime())) {
    return new Intl.DateTimeFormat("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(direct);
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
};

const Done: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (storedUser?.email) {
      setEmail(storedUser.email);
    } else {
      alert("User not logged in. Redirecting to login page...");
      router.push("/Login");
    }
  }, [router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!email) {
        return;
      }

      try {
        const response = await fetch(`/api/order?email=${email}`);
        const data = await response.json();

        if (response.ok && data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          console.error("No order found.");
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [email]);

  const handleOrderAgain = () => {
    router.push("/Order");
  };

  const handleOrderHistory = () => {
    router.push("/History");
  };

  const totalAmount = order ? toCurrencyNumber(order.total_price) : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#082f49)]" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-5rem] h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <div className="inline-flex w-fit items-center gap-3 rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-cyan-200">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/30">
                <FaCheckCircle className="text-3xl" />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
                  Status
                </span>
                <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  Payment Complete
                </span>
              </span>
            </div>

            <h1 className="mt-6 max-w-[12ch] text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Thank you for your order.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Your payment has been recorded and your request is now part of our processing queue. We appreciate your
              trust in God&apos;s Gift Water Station.
            </p>

            {isLoading ? (
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-8 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300" />
                <p className="mt-4 text-sm text-slate-300">Loading your order details...</p>
              </div>
            ) : order ? (
              <div className="mt-8 rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/10 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order Date</p>
                    <p className="mt-2 font-semibold text-white">{formatDate(order.date)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order Time</p>
                    <p className="mt-2 font-semibold text-white">{formatTime(order.time)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Water Type</p>
                    <p className="mt-2 font-semibold text-white">{order.water_type}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</p>
                    <p className="mt-2 font-semibold text-white">
                      {order.gallon_count} gallon{order.gallon_count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Total Amount</p>
                  <p className="mt-2 text-3xl font-semibold text-white">PHP {totalAmount.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-8 text-center">
                <p className="text-lg font-semibold text-white">Order details are not available right now.</p>
                <p className="mt-2 text-sm text-slate-400">You can still place another order or view your history below.</p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleOrderAgain}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Order Again
                <FaArrowRight className="text-sm" />
              </button>
              <button
                onClick={handleOrderHistory}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 text-base font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
              >
                Order History
                <FaHistory className="text-sm" />
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Stay Hydrated</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">We appreciate your business with us.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                May we continue to provide you with fresh, clean, and reliable water for every household need.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5 text-center">
                <Image src={waterdropImage} alt="Water Drop" width={88} height={88} className="mx-auto" />
                <p className="mt-4 text-sm font-semibold text-white">Pure supply</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Clean hydration</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5 text-center">
                <Image src={wallclockImage} alt="Wall Clock" width={88} height={88} className="mx-auto" />
                <p className="mt-4 text-sm font-semibold text-white">On-time service</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Reliable schedule</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5 text-center">
                <Image src={drinkwaterImage} alt="Drink Water" width={88} height={88} className="mx-auto" />
                <p className="mt-4 text-sm font-semibold text-white">Healthy living</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Refresh every day</p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/10 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/30 text-cyan-200">
                  <FaTint className="text-sm" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Customer Message</p>
                  <p className="mt-2 text-sm leading-7 text-slate-100">
                    Stay cool, stay refreshed, and come back anytime you need another smooth and simple water order.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Done;
