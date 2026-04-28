import React from "react";
import { useRouter } from "next/router";
import Image, { StaticImageData } from "next/image";
import { FaArrowRight, FaCheckCircle, FaMapMarkerAlt, FaRegUserCircle, FaSignOutAlt, FaTint } from "react-icons/fa";
import one from "../public/1.jpg";
import two from "../public/2.jpg";
import three from "../public/3.jpg";
import four from "../public/4.jpg";
import five from "../public/5.jpg";
import Mineral from "../public/mineral.jpg";
import Mineralwater from "../public/mineral(1).jpg";
import Angle from "../public/angle.png";
import Distilled from "../public/distilled.jpg";
import Distilledwater from "../public/Distilled(1).jpg";
import Alkaline from "../public/alkaline.jpg";
import Alkalinewater from "../public/alkaline(1).jpg";

type Highlight = {
  src: StaticImageData;
  title: string;
  text: string;
};

type WaterCategory = {
  title: string;
  description: string;
  images: { src: StaticImageData; alt: string }[];
};

const highlights: Highlight[] = [
  {
    src: one,
    title: "Established in 2019",
    text: "God's Gift Water Refilling Station was established on March 4, 2019.",
  },
  {
    src: two,
    title: "Hydration for Every Need",
    text: "We offer purified water for your daily household and hydration needs.",
  },
  {
    src: three,
    title: "Monthly Water Sampling",
    text: "We conduct water sampling every first week of the month to maintain clean, high-quality supply.",
  },
  {
    src: four,
    title: "DOH Certified",
    text: "Our water refilling station is certified to support safe and reliable service.",
  },
  {
    src: five,
    title: "Located in Samal",
    text: "Visit us at Zone 7, Brgy. Villarica, Babak District, Island Garden City of Samal.",
  },
];

const waterCategories: WaterCategory[] = [
  {
    title: "Mineral Water",
    description:
      "Mineral water is also known as spring water because it comes from natural springs and contains beneficial minerals.",
    images: [
      { src: Mineral, alt: "Mineral water display" },
      { src: Mineralwater, alt: "Mineral water product" },
    ],
  },
  {
    title: "Purified Water",
    description:
      "Purified water is produced through careful purification of drinking water or groundwater for cleaner everyday consumption.",
    images: [
      { src: Angle, alt: "Purified water station" },
      { src: one, alt: "Purified water business" },
    ],
  },
  {
    title: "Distilled Water",
    description:
      "Distilled water is produced by boiling water and condensing the steam back into liquid for higher purity.",
    images: [
      { src: Distilled, alt: "Distilled water product" },
      { src: Distilledwater, alt: "Distilled water bottle" },
    ],
  },
  {
    title: "Alkaline Water",
    description:
      "Naturally alkaline water passes over rocks and minerals, which can increase its alkaline level.",
    images: [
      { src: Alkaline, alt: "Alkaline water product" },
      { src: Alkalinewater, alt: "Alkaline water bottle" },
    ],
  },
];

const Information: React.FC = () => {
  const router = useRouter();
  
  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to log out user", error);
    }

    router.push("/Login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#082f49)]" />
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-5rem] h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">
                Official Information Page
              </p>
              <h1 className="mt-2 text-xl font-semibold tracking-[0.14em] text-white sm:text-2xl">
                GOD&apos;S GIFT WATER STATION
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

        <section className="mb-10 rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Visit Us</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Ready to place your next order?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
                We are located at Zone 7, Brgy. Villarica, Babak District, Island Garden City of Samal. Continue to
                the order page to choose your water type and quantity.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-5 py-4 text-sm text-slate-200">
                <FaMapMarkerAlt className="text-cyan-200" />
                Samal, Davao del Norte
              </div>
              <button
                onClick={() => router.push("/Order")}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Proceed to Order
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Clean. Safe. Reliable.
            </p>
            <h2 className="mt-6 max-w-[15ch] text-5xl font-semibold leading-[1.05] text-white lg:text-6xl">
              Pure water solutions for every home and every day.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              We provide pure and clean water for all your hydration needs, with trusted service, certified quality,
              and a smoother ordering experience for our customers.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Since</p>
                <p className="mt-3 text-2xl font-semibold text-white">2019</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Certified</p>
                <p className="mt-3 text-2xl font-semibold text-white">DOH Ready</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Service</p>
                <p className="mt-3 text-2xl font-semibold text-white">Trusted Supply</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl">
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <Image
                src={two}
                alt="God's Gift Water Refilling Station"
                className="h-[360px] w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
                    <FaTint />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Our Promise</p>
                    <p className="mt-2 max-w-md text-base leading-7 text-slate-100">
                      Clean water, consistent quality, and dependable service for every customer we serve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Business Highlights</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">What makes our station trusted</h3>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-xl shadow-slate-950/30 backdrop-blur-xl"
              >
                <div className="relative h-56">
                  <Image src={item.src} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Water Options</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">Explore our available water types</h3>
          </div>

          <div className="space-y-8">
            {waterCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl"
              >
                <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h4 className="text-3xl font-semibold text-white">{category.title}</h4>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{category.description}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                    <FaCheckCircle />
                    Available Now
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {category.images.map((image) => (
                    <div key={image.alt} className="relative overflow-hidden rounded-[1.5rem]">
                      <Image src={image.src} alt={image.alt} className="h-[260px] w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Information;
