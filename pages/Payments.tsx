import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import gcash from "../public/gqr.jpg"; // Ensure this path is correct
import { UserCircleIcon } from "@heroicons/react/solid"; // For the profile icon

type Order = {
  id: string;
  water_type: string;
  gallon_count: number;
  total_price: number;
};

const Payments: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const pricePerGallon = 15; // Define price per gallon here
  const [Email, setUserEmail] = useState<string>("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null); // Track the payment proof file
  const [warningMessage, setWarningMessage] = useState<string>(""); // Track warning message

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
      if (!Email) return;

      try {
        const response = await fetch(`/api/order?email=${Email}`);
        const data = await response.json();

        if (!response.ok || !data.orders) {
          console.error("API returned an error:", data.error || "Unknown error");
          setOrders([]);
          return;
        }

        // Enrich the orders with total_price calculation
        const enrichedOrders = (data.orders || []).map((order: Order) => ({
          ...order,
          total_price: order.gallon_count * pricePerGallon,
        }));

        setOrders(enrichedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [Email]);

  const fetchAddress = () => {
    if (navigator.geolocation) {
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
            setAddress("Unable to fetch address."); // No error parameter
          } finally {
            setIsFetching(false);
          }
        },
        () => {
          setAddress("Permission denied or location unavailable.");
          setIsFetching(false);
        }
      );
    } else {
      setAddress("Geolocation is not supported by your browser.");
    }
  };
  

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
  
    if (paymentMethod === "online" && !paymentProof) {
      setWarningMessage("Please upload the payment proof.");
      return; // Prevent form submission
    }
  
    const selectedOrder = orders[0]; // Assuming only one order for simplicity
    const paymentData = {
      water_type: selectedOrder.water_type,
      gallon_count: selectedOrder.gallon_count,
      total_price: selectedOrder.total_price,
      address: address ? address : null,
      payment_method: paymentMethod, // Include selected payment method
      payment_status: paymentMethod === "online" ? "paid" : "pending", // Set status to "paid" if online
      email: Email,
    };
  
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
    }
  };
  

  const handleCancel = () => {
    router.push("/Order");
  };

  const handlePaymentMethodChange = (method: "cod" | "online") => {
    setPaymentMethod(method);
    if (method === "cod") {
      fetchAddress();
    }
    // You may also fetch the address if you want it available for online payments
    if (method === "online") {
      fetchAddress(); // Fetch address for online payment as well
    }
  };

  const goToProfile = () => {
    router.push("/Profile");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPaymentProof(file);
    setWarningMessage(""); // Reset warning message when file is selected
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-full bg-gradient-to-br from-cyan-400 to-indigo-600 gap-40">
      <div className="bg-white bg-opacity-80 rounded-[10px] p-9 shadow-2xl w-[500px]">
        <div
          className="absolute top-4 left-4 cursor-pointer"
          onClick={goToProfile}
        >
          <UserCircleIcon className="h-10 ml-5 text-blue-600 hover:text-blue-950" />
        </div>

        <form onSubmit={handleCheckout}>
          <div className="text-center mb-4">
            <h1 className="text-4xl font-semibold text-blue-900">
              SETTLE YOUR PAYMENT
            </h1>
          </div>

          <div className="flex justify-center gap-12 mb-8">
            <button
              type="button"
              className={`px-6 py-3 rounded mt-2 ${
                paymentMethod === "cod"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-blue-500"
              } hover:bg-blue-600 active:bg-indigo-600 active:scale-95`}
              onClick={() => handlePaymentMethodChange("cod")}
            >
              Cash on Delivery
            </button>
            <button
              type="button"
              className={`px-6 py-3 rounded mt-2 ${
                paymentMethod === "online"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-blue-500"
              } hover:bg-blue-600 active:bg-indigo-600 active:scale-95`}
              onClick={() => handlePaymentMethodChange("online")}
            >
              Online Payment
            </button>
          </div>

          {warningMessage && (
            <div className="bg-red-200 text-red-600 p-4 mb-4 rounded">
              {warningMessage}
            </div>
          )}

          <div className="payment-container">
            {orders.length === 0 ? (
              <p className="text-center text-xl text-red-600">No orders found</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="mt-6 flex justify-between">
                  <div className="w-1/4">
                    <input
                      type="text"
                      value={order.water_type || ""}
                      readOnly
                      placeholder="Water Type"
                      className="text-md font-semibold text-blue-900 bg-gray-100 p-3 border-2 border-blue-600 rounded w-full"
                    />
                  </div>
                  <div className="w-1/4">
                    <input
                      type="number"
                      value={order.gallon_count || 0}
                      readOnly
                      placeholder="Gallon Count"
                      className="text-md font-semibold text-blue-900 bg-gray-100 p-3 border-2 border-blue-600 rounded w-full"
                    />
                  </div>
                  <div className="w-1/4">
                    <input
                      type="text"
                      value={`₱${order.total_price}`}
                      readOnly
                      placeholder="Total Price"
                      className="text-md font-semibold text-blue-900 bg-gray-100 p-3 border-2 border-blue-600 rounded w-full"
                    />
                  </div>
                  {/* Display the user's email */}
                  <div className="w-1/4">
                    <input
                      type="text"
                      value={Email || ""}
                      readOnly
                      placeholder="User Email"
                      className="text-md font-semibold text-blue-900 bg-gray-100 p-3 border-2 border-blue-600 rounded w-full"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {paymentMethod === "cod" && (
            <div className="text-center mb-6 mt-6">
              <h2 className="text-3xl font-semibold text-blue-900 mb-4">
                Your Real-Time Address
              </h2>
              {isFetching ? (
                <p className="text-lg text-gray-700">Fetching your address...</p>
              ) : (
                <input
                  type="text"
                  value={address || ""}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full p-3 border rounded"
                />
              )}
            </div>
          )}

          {paymentMethod === "online" && (
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold text-blue-900 mb-8">
                Online Payment Details
              </h2>
              <p className="text-xl mb-4 ml-2">Step 1: Scan the QR Code</p>
              <p className="text-xl mb-4 ml-2">Step 2: Attach your Proof here</p>
              <p className="text-xl mb-4 ml-2">Step 3: Click Check-Out</p>
              <input
                type="file"
                name="proofFile"
                accept="image/*"
                className="block mb-4 ml-2"
                onChange={handleFileUpload} // Handle file upload
              />

              <div className="text-center mb-6 mt-6">
                <h2 className="text-3xl font-semibold text-blue-900 mb-4">
                  Your Real-Time Address
                </h2>
                {isFetching ? (
                  <p className="text-lg text-gray-700">Fetching your address...</p>
                ) : (
                  <input
                    type="text"
                    value={address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full p-3 border rounded"
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-12 mb-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-10 py-3 bg-blue-500 text-black rounded mt-5 hover:bg-blue-600 active:bg-indigo-600 active:scale-95"
            >
              Cancel Order
            </button>
            <button
              type="submit"
              disabled={!paymentMethod || (paymentMethod === "online" && !paymentProof)} // Disable if no proof for online payment
              className="px-10 py-3 bg-blue-500 text-black rounded mt-5 hover:bg-blue-600 active:bg-indigo-600 active:scale-95"
            >
              Check-Out
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-blue-900 text-5xl font-semibold">GOD&apos;S GIFT</h1>
        <h2 className="text-white text-3xl mt-2">PURE WATER</h2>
        <p className="text-blue-950 text-lg mt-6">
          &quot;Indulge in the essence of Pure Hydration&quot;
        </p>
        <div className="mt-4 text-center">
          <p className="text-blue-900 text-lg font-bold">GCash No.</p>
          <p className="text-lg font-bold">09919674714</p>
          <Image
            src={gcash}
            alt="GCash QR Code"
            width={300}
            height={300}
            className="rounded-lg shadow-2xl mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Payments;
