import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { PencilIcon, UserCircleIcon } from "@heroicons/react/solid";
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaSave, FaTimes } from "react-icons/fa";

type Profile = {
  email: string;
  name: string;
  address: string;
  contact: string;
};

type EditableField = "name" | "address" | "contact";

const fieldMeta: Record<
  EditableField,
  {
    label: string;
    icon: React.ReactNode;
    placeholder: string;
  }
> = {
  name: {
    label: "Full Name",
    icon: <UserCircleIcon className="h-5 w-5" />,
    placeholder: "Enter your full name",
  },
  address: {
    label: "Address",
    icon: <FaMapMarkerAlt className="h-4 w-4" />,
    placeholder: "Enter your address",
  },
  contact: {
    label: "Contact Number",
    icon: <FaPhoneAlt className="h-4 w-4" />,
    placeholder: "Enter your contact number",
  },
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!storedUser?.email) {
      alert("User not logged in. Redirecting to login page...");
      router.push("/Login");
      return;
    }

    fetch(`/api/profile?email=${storedUser.email}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
        } else {
          alert(data.message || "User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        alert("Error fetching user profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleEdit = (field: EditableField, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSave = async (field: EditableField) => {
    if (!profile) {
      return;
    }

    const updatedProfile = {
      ...profile,
      [field]: tempValue,
    };

    setProfile(updatedProfile);
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      alert(data.message || "Profile updated successfully");
      setEditingField(null);
      setTempValue("");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
      setProfile(profile);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#082f49)]" />
        <div className="relative rounded-[2rem] border border-white/10 bg-white/10 px-8 py-10 text-center backdrop-blur-xl">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-300" />
          <p className="mt-5 text-sm uppercase tracking-[0.28em] text-cyan-200">Loading Profile</p>
          <p className="mt-2 text-sm text-slate-300">Please wait while we get your account details.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#082f49)]" />
      <div className="absolute left-[-7rem] top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
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
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">Account Profile</p>
              <h1 className="mt-2 text-xl font-semibold tracking-[0.14em] text-white sm:text-2xl">
                MANAGE YOUR DETAILS
              </h1>
            </div>
          </div>

          <button
            onClick={() => router.push("/Information")}
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-semibold text-slate-200 backdrop-blur-xl transition hover:border-cyan-300/30 hover:text-white"
          >
            <FaArrowLeft className="text-xs" />
            Back to Information
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <UserCircleIcon className="h-14 w-14" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Customer Account</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{profile.name || "Customer Profile"}</h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
                Review and update your personal details to keep your deliveries and account records accurate.
              </p>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-cyan-400/15 bg-slate-950/30 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                  <FaEnvelope className="text-sm" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Email Address</p>
                  <p className="mt-2 break-all text-base font-semibold text-white">{profile.email}</p>
                  <p className="mt-2 text-sm text-slate-400">This is your primary login and account identifier.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile</p>
                <p className="mt-3 text-lg font-semibold text-white">Active</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Editable</p>
                <p className="mt-3 text-lg font-semibold text-white">3 Fields</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
                <p className="mt-3 text-lg font-semibold text-white">Secure</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Editable Details</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Update your profile information</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Use the edit button on any field below. Your changes are saved directly to your account.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              {(["name", "address", "contact"] as EditableField[]).map((field) => {
                const isEditing = editingField === field;
                const value = profile[field];

                return (
                  <div
                    key={field}
                    className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-5 transition hover:border-cyan-400/20"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                          {fieldMeta[field].icon}
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            {fieldMeta[field].label}
                          </p>
                          <p className="mt-2 text-base font-semibold text-white">{value || "Not set yet"}</p>
                        </div>
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => handleEdit(field, value)}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditing && (
                      <div className="mt-5">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          placeholder={fieldMeta[field].placeholder}
                          className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                        />
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                          <button
                            onClick={handleCancel}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-200 transition hover:text-white"
                          >
                            <FaTimes className="text-xs" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSave(field)}
                            disabled={isSaving}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <FaSave className="text-xs" />
                            {isSaving ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
