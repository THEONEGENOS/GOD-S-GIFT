import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFacebookF,
  FaLock,
} from "react-icons/fa";
import IconWrapper from "../components/IconWrapper";

const Register: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmpassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmpassword) {
      alert("Please fill out all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "user",
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      localStorage.setItem("registeredUser", JSON.stringify({ email, password }));

      alert("Registration successful!");
      router.push("/Login");
    } catch (error) {
      alert(`Registration error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_32%),linear-gradient(135deg,_#020617,_#0f172a_58%,_#082f49)]" />
      <div className="absolute right-[-4rem] top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-[-6rem] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <section className="mx-auto w-full max-w-md lg:order-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-200">
                New Account
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Create your profile</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Register to start ordering water, managing deliveries, and reviewing your purchase history.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="register-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-4 pr-12 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  />
                  <IconWrapper className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaEnvelope />
                  </IconWrapper>
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-4 pr-24 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
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

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-200">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    required
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-4 pr-24 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  />
                  <IconWrapper className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaCheckCircle />
                  </IconWrapper>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-200"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <IconWrapper>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</IconWrapper>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-400 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Creating account..." : "Register"}
                {!isLoading && <FaArrowRight className="text-sm" />}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4 text-sm text-slate-300">
              Already have an account?{" "}
              <Link href="/Login" className="font-semibold text-cyan-200 transition hover:text-white">
                Sign in here
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
              Visit our Facebook page
              <FaArrowRight className="text-xs" />
            </a>
          </div>
        </section>

        <section className="hidden lg:block lg:order-1">
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
                  Official Register Portal
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[0.14em] text-white">
                  GOD&apos;S GIFT WATER STATION
                </h2>
              </div>
            </div>

            <h2 className="mt-6 max-w-[24ch] text-[2.45rem] font-medium leading-[1.22] text-white lg:text-[2.85rem]">
              Build your account in minutes and start ordering with confidence.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              A streamlined registration flow designed to help customers get started quickly while keeping the experience trustworthy and polished.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-lg font-semibold text-white">Easy onboarding</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Simple account creation with clear form guidance and a cleaner visual structure.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-lg font-semibold text-white">Ready for repeat orders</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Create your account once, then return anytime to place new orders and review your history.
                </p>
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
                  <p className="mt-1 text-base font-semibold text-white">Explore promotions, updates, and announcements</p>
                </div>
              </div>
              <FaArrowRight className="text-xs" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
