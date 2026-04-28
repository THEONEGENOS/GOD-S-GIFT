import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaEnvelope, FaEye, FaEyeSlash, FaFacebookF, FaLock } from "react-icons/fa";
import IconWrapper from "../components/IconWrapper";

const Login: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEntering, setIsEntering] = useState<boolean>(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    if (email === "admin@gmail.com" && password === "GodsGift2019") {
      const admin = {
        email,
        password,
      };

      localStorage.setItem("user", JSON.stringify(admin));
      setIsEntering(true);
      await router.push("Admin");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("user", JSON.stringify(result.user));
        setIsEntering(true);
        await router.push("/Information");
      } else {
        throw new Error("Logging in failed");
      }
    } catch (error) {
      alert(`Login error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {isEntering && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[2rem] border border-cyan-400/20 bg-slate-900/85 p-8 text-center shadow-2xl shadow-slate-950/50">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300" />
            <h2 className="mt-6 text-2xl font-semibold text-white">Entering your account...</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Please wait while we prepare your dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#082f49)]" />
      <div className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-5rem] right-[-4rem] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
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
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">
                  Official Login Portal
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[0.14em] text-white">
                  GOD&apos;S GIFT WATER STATION
                </h1>
              </div>
            </div>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Sign in to place orders, track deliveries, and review your account activity from one professional dashboard.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Fast</p>
                <p className="mt-3 text-lg font-semibold text-white">Quick ordering flow</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Secure</p>
                <p className="mt-3 text-lg font-semibold text-white">Protected account access</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Simple</p>
                <p className="mt-3 text-lg font-semibold text-white">Clear order history</p>
              </div>
            </div>

            <a
              href="https://www.facebook.com/Gods.Gift.Office"
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex items-center justify-between gap-4 rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/15 hover:text-white"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white">
                  <FaFacebookF className="text-sm" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Owner Facebook Page</p>
                  <p className="mt-1 text-base font-semibold text-white">Check updates, promotions, and announcements</p>
                </div>
              </div>
              <FaArrowRight className="text-xs" />
            </a>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-200">
                Welcome Back
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to your account</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Enter your details below to continue to your water ordering dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-4 pr-12 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                    required
                  />
                  <IconWrapper className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaEnvelope />
                  </IconWrapper>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-4 pr-24 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                    required
                  />
                  <IconWrapper className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaLock />
                  </IconWrapper>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <IconWrapper>{showPassword ? <FaEyeSlash /> : <FaEye />}</IconWrapper>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-400 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Login"}
                {!isLoading && <FaArrowRight className="text-sm" />}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4 text-sm text-slate-300">
              Don&apos;t have an account?{" "}
              <Link href="/Register" className="font-semibold text-cyan-200 transition hover:text-white">
                Create one here
              </Link>
            </div>

            <a
              href="https://www.facebook.com/Gods.Gift.Office"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-200 lg:hidden"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2] text-white">
                <FaFacebookF className="text-xs" />
              </span>
              Check our Facebook page
              <FaArrowRight className="text-xs" />
            </a>
          </div>
        </section>
      </div>
    </div>    
  );
};

export default Login;
