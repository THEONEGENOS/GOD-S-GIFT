import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/solid";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTint,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa";
import IMGwater from "../public/angle.png";

const waterTypes = ["Purified Water", "Mineral Water", "Distilled Water", "Alkaline Water"];

const Order: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedWaterType, setSelectedWaterType] = useState<string | null>(null);
  const [gallonCount, setGallonCount] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const pricePerGallon = 15;
  const totalPrice = gallonCount * pricePerGallon;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (storedUser?.email) {
      setEmail(storedUser.email);
    } else {
      alert("User not logged in. Redirecting to login page...");
      router.push("/Login");
    }
  }, [router]);

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !dateRef.current?.value ||
      !timeRef.current?.value ||
      !selectedOption ||
      !selectedWaterType ||
      gallonCount < 1 ||
      !email
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateRef.current.value,
          time: timeRef.current.value,
          gallonCount,
          deliveryType: selectedOption,
          waterType: selectedWaterType,
          email,
        }),
      });

      if (response.ok) {
        alert("Order Placed!!");
        router.push("/OrderSummary");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "An error occurred while placing your order.");
      }
    } catch (error) {
      console.error("Failed to place the order", error);
      alert("There was an issue placing your order. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/Login");
  };

  const handleGallonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setGallonCount(Number.isNaN(value) ? 1 : value >= 1 ? value : 1);
  };

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
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">Order Water</p>
              <h1 className="mt-2 text-xl font-semibold tracking-[0.14em] text-white sm:text-2xl">
                PLACE YOUR NEXT ORDER
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
                <UserCircleIcon className="h-7 w-7" />
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
              Clean. Fast. Reliable.
            </p>
            <h2 className="mt-6 max-w-[14ch] text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Fresh water ordering made simple.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Choose your order type, set your schedule, and confirm the water you need in one smooth form.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Price</p>
                <p className="mt-3 text-lg font-semibold text-white">PHP 15 / Gallon</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Options</p>
                <p className="mt-3 text-lg font-semibold text-white">Delivery or Pick-Up</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Water Types</p>
                <p className="mt-3 text-lg font-semibold text-white">4 Available</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10">
              <div className="relative h-[320px]">
                <Image src={IMGwater} alt="Water station" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
                      <FaTint />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
                        Service Promise
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-7 text-slate-100">
                        Clean water, dependable delivery scheduling, and a smoother ordering experience for every customer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Order Form</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Make your order</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Complete the details below so we can prepare your order correctly and on time.
              </p>
            </div>

            <form onSubmit={handleProceed} className="mt-8 space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-200">Choose Order Type</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOption("delivery")}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      selectedOption === "delivery"
                        ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                        : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-cyan-400/20"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                        <FaTruck className="text-sm" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">Delivery</span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                          Delivered to your location
                        </span>
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOption("pickup")}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      selectedOption === "pickup"
                        ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                        : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-cyan-400/20"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                        <FaWarehouse className="text-sm" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">Pick-Up</span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                          Collect from our station
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-2 block text-sm font-medium text-slate-200">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      id="date"
                      type="date"
                      ref={dateRef}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 pr-12 text-white focus:border-cyan-400/60 focus:outline-none"
                      required
                    />
                    <FaCalendarAlt className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="mb-2 block text-sm font-medium text-slate-200">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <input
                      id="time"
                      type="time"
                      ref={timeRef}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 pr-12 text-white focus:border-cyan-400/60 focus:outline-none"
                      required
                    />
                    <FaClock className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="waterType" className="mb-2 block text-sm font-medium text-slate-200">
                  Select Water Type
                </label>
                <select
                  id="waterType"
                  value={selectedWaterType || ""}
                  onChange={(e) => setSelectedWaterType(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white focus:border-cyan-400/60 focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    Select Water Type
                  </option>
                  {waterTypes.map((type) => (
                    <option key={type} value={type} className="text-slate-950">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOption === "pickup" && (
                <div className="rounded-[1.5rem] border border-cyan-400/15 bg-cyan-400/10 p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/30 text-cyan-200">
                      <FaMapMarkerAlt className="text-sm" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Pick-Up Location</p>
                      <a
                        href="https://maps.app.goo.gl/UgH5SyHRmjwohuVy7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-sm leading-7 text-slate-100 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-white"
                      >
                        Zone 7, Brgy. Villarica, Babak District, Island Garden City of Samal
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <label htmlFor="gallonCount" className="mb-2 block text-sm font-medium text-slate-200">
                    Gallon Quantity
                  </label>
                  <input
                    id="gallonCount"
                    type="number"
                    value={gallonCount}
                    onChange={handleGallonChange}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-center text-white focus:border-cyan-400/60 focus:outline-none"
                    required
                    min="1"
                    step="1"
                  />
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Estimated Total</p>
                  <p className="mt-3 text-3xl font-semibold text-white">PHP {totalPrice}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Based on {gallonCount} gallon{gallonCount > 1 ? "s" : ""} at PHP {pricePerGallon} each.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-400 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Proceed to Summary
                <FaArrowRight className="text-sm" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Order;
