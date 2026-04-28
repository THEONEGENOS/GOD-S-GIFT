import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/solid";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaQrcode,
  FaSignOutAlt,
  FaTint,
} from "react-icons/fa";
import gcash from "../public/gqr.jpg";

type Order = {
  id: string;
  water_type: string;
  gallon_count: number;
  total_price: number | string;
};

const toCurrencyNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const Payments: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [email, setUserEmail] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  const fetchAddress = () => {
    if (!navigator.geolocation) {
      setAddress("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setAddress(data.display_name || "Address not found.");
        } catch {
          setAddress("Unable to fetch address.");
        } finally {
          setIsFetching(false);
        }
      },
      () => {
        setAddress("Permission denied or location unavailable.");
        setIsFetching(false);
      }
    );
  };

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (orders.length === 0) {
      alert("No orders found.");
      return;
    }

    if (paymentMethod === "online" && !paymentProof) {
      setWarningMessage("Please upload the payment proof.");
      return;
    }

    const selectedOrder = orders[0];
    const paymentData = {
      water_type: selectedOrder.water_type,
      gallon_count: selectedOrder.gallon_count,
      total_price: selectedOrder.total_price,
      address: address || null,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "online" ? "paid" : "pending",
      email,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Trade Successful!!");
        router.push("/Done");
      } else {
        alert(`Failed to process payment: ${result.error}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred while processing your payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/OrderSummary");
  };

  const handlePaymentMethodChange = (method: "cod" | "online") => {
    setPaymentMethod(method);
    setWarningMessage("");
    fetchAddress();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/Login");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPaymentProof(file);
    setWarningMessage("");
  };

  const totalGallons = orders.reduce((sum, order) => sum + order.gallon_count, 0);
  const grandTotal = orders.reduce((sum, order) => sum + toCurrencyNumber(order.total_price), 0);

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
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">Payment Center</p>
              <h1 className="mt-2 text-xl font-semibold tracking-[0.14em] text-white sm:text-2xl">
                SETTLE YOUR PAYMENT
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
              Secure Checkout
            </p>
            <h2 className="mt-6 max-w-[14ch] text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Choose how you want to complete your payment.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Review your order, confirm your location, and finish payment using the method that works best for you.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Orders</p>
                <p className="mt-3 text-lg font-semibold text-white">{orders.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Gallons</p>
                <p className="mt-3 text-lg font-semibold text-white">{totalGallons}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total</p>
                <p className="mt-3 text-lg font-semibold text-white">PHP {grandTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/10 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/30 text-cyan-200">
                  <FaQrcode className="text-sm" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">GCash Details</p>
                  <p className="mt-2 text-base font-semibold text-white">09919674714</p>
                  <p className="mt-2 text-sm leading-7 text-slate-100">
                    Use this number or scan the QR code if you choose online payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
              <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-[1.5rem] border border-white/10">
                <Image src={gcash} alt="GCash QR Code" fill className="object-cover" priority />
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Checkout Details</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Complete your payment</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Pick a payment method below, then confirm the order details before checkout.
              </p>
            </div>

            <form onSubmit={handleCheckout} className="mt-8 space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-200">Choose Payment Method</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("cod")}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      paymentMethod === "cod"
                        ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                        : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-cyan-400/20"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                        <FaMoneyBillWave className="text-sm" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">Cash on Delivery</span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                          Pay when received
                        </span>
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("online")}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      paymentMethod === "online"
                        ? "border-cyan-300/40 bg-cyan-400/15 text-white"
                        : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-cyan-400/20"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                        <FaQrcode className="text-sm" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">Online Payment</span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
                          GCash with proof upload
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {warningMessage && (
                <div className="rounded-[1.5rem] border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-red-200">
                  {warningMessage}
                </div>
              )}

              {isLoading ? (
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-8 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300" />
                  <p className="mt-4 text-sm text-slate-300">Loading payment details...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-8 text-center">
                  <p className="text-lg font-semibold text-white">No orders found.</p>
                  <p className="mt-2 text-sm text-slate-400">Create an order first before proceeding to payment.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5 transition hover:border-cyan-400/20"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Water Type</p>
                          <p className="mt-2 font-semibold text-white">{order.water_type}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Customer Email</p>
                          <p className="mt-2 break-all font-semibold text-white">{email}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gallons</p>
                          <p className="mt-2 font-semibold text-white">{order.gallon_count}</p>
                        </div>
                        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Total Price</p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            PHP {toCurrencyNumber(order.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {paymentMethod && orders.length > 0 && (
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      <FaMapMarkerAlt className="text-sm" />
                    </span>
                    <div className="w-full">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Real-Time Address</p>
                      {isFetching ? (
                        <p className="mt-3 text-sm text-slate-300">Fetching your address...</p>
                      ) : (
                        <input
                          type="text"
                          value={address || ""}
                          onChange={(e) => setAddress(e.target.value)}
                          className="mt-3 h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                          placeholder="Your address will appear here"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "online" && orders.length > 0 && (
                <div className="rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/10 p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/30 text-cyan-200">
                      <FaCloudUploadAlt className="text-sm" />
                    </span>
                    <div className="w-full">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Payment Proof</p>
                      <p className="mt-2 text-sm leading-7 text-slate-100">
                        Scan the QR code, complete your payment, then upload your proof before checkout.
                      </p>
                      <input
                        type="file"
                        name="proofFile"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="mt-4 block w-full text-sm text-slate-200 file:mr-4 file:rounded-2xl file:border-0 file:bg-white/10 file:px-4 file:py-3 file:font-semibold file:text-cyan-100 hover:file:bg-white/15"
                      />
                      {paymentProof && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                          <FaCheckCircle className="text-xs" />
                          {paymentProof.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
                >
                  <FaArrowLeft className="text-xs" />
                  Back to Summary
                </button>

                <button
                  type="submit"
                  disabled={
                    !paymentMethod ||
                    orders.length === 0 ||
                    isSubmitting ||
                    (paymentMethod === "online" && !paymentProof)
                  }
                  className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Processing..." : "Check-Out"}
                  {!isSubmitting && <FaTint className="text-sm" />}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Payments;
