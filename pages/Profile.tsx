import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/solid"; // Using Heroicons for icons
import { useRouter } from "next/router";

type Profile = {
  email: string;
  name: string;
  address: string;
  contact: string;
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null); // Store profile data
  const [editingField, setEditingField] = useState<string | null>(null); // Tracks the field being edited
  const [tempValue, setTempValue] = useState<string>(""); // Temporary value during editing

  // Fetch user data from the backend when the component mounts
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(storedUser);

  if (storedUser?.email) {
    fetch(`/api/profile?email=${storedUser.email}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user); // Make sure the email is present in `data.user`
        } else {
          alert(data.message || "User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        alert("Error fetching user profile");
      });
  } else {
    alert("User not logged in. Redirecting to login page...");
    router.push("/Login");
  }
}, [router]);


  const handleSave = (field: string) => {
    if (profile) {
      if (field === "name") setProfile({ ...profile, name: tempValue });
      if (field === "address") setProfile({ ...profile, address: tempValue });
      if (field === "contact") setProfile({ ...profile, contact: tempValue });

      // Send the updated profile to the backend for saving
      fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          address: profile.address,
          contact: profile.contact,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message || "Profile updated successfully");
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          alert("Error updating profile");
        });
    }

    setEditingField(null); // Close the edit mode
  };

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue); // Set the value for editing
  };

  if (!profile) {
    return <div>Loading...</div>; // Display loading while fetching data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Profile</h1>
        <div className="space-y-4">
          {/* Display Email without editing */}
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
          </div>

          {/* Editable Name */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
            </div>
            <PencilIcon
              className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleEdit("name", profile.name)}
            />
          </div>
          {editingField === "name" && (
            <div className="mt-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setEditingField(null)} // Cancel editing
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => handleSave("name")} // Save the name
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Editable Address */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-lg font-semibold text-gray-800">{profile.address}</p>
            </div>
            <PencilIcon
              className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleEdit("address", profile.address)}
            />
          </div>
          {editingField === "address" && (
            <div className="mt-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setEditingField(null)} // Cancel editing
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => handleSave("address")} // Save the address
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Editable Contact */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Contact</p>
              <p className="text-lg font-semibold text-gray-800">{profile.contact}</p>
            </div>
            <PencilIcon
              className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleEdit("contact", profile.contact)}
            />
          </div>
          {editingField === "contact" && (
            <div className="mt-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setEditingField(null)} // Cancel editing
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => handleSave("contact")} // Save the contact
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            className="w-full text-center text-sm text-white bg-gray-400 py-2 rounded-md hover:bg-gray-500"
            onClick={() => window.history.back()}
          >
            &larr; Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
