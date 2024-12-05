import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import sumImage from "../public/show.png"; // Ensure this path is correct
import { UserCircleIcon } from "@heroicons/react/solid"; // For the profile icon

// Define the Order type for TypeScript
type Order = {
  id: string; // Assuming orders have a unique ID
  date: string;
  time: string;
  gallon_count: number;
  delivery_type: string;
  water_type: string;
  total_price?: number; // Add optional total_price property
};

const OrderSummary: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]); // State to hold orders
  const [orderID, setOrderID] = useState('');
  const pricePerGallon = 15; // Define price per gallon here
  const [Email, setUserEmail] = useState<string>("");

  // Fetch user email from localStorage or another auth context
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.email) {
      setUserEmail(storedUser.email);
    } else {
      alert("User not logged in. Redirecting to login page...");
      router.push("/Login");
    }
  }, [router]);

  // Fetch orders for the logged-in user's email
  useEffect(() => {
    const fetchOrders = async () => {
      if (!Email) return;

      try {
        const response = await fetch(`/api/order?email=${Email}`);
        const data = await response.json();
        setOrderID(data.orders[0].id)

        if (!response.ok || !data.orders) {
          console.error("API returned an error:", data.error || "Unknown error");
          setOrders([]); // Handle error gracefully
          
          return;
        }

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

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/order`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });

      if (response.ok) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } else {
        console.error("Failed to delete order:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleBack = (id: string) => {
    handleDeleteOrder(id);
    router.push("/Order")
  }

  const goToProfile = () => {
    router.push("/Profile"); // Redirect to the profile page
  };

  const handleOrderSummary = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/Payments");
  };

  return (
    <div className="flex flex-row min-w-screen min-h-screen justify-center items-center gap-24 bg-gradient-to-br from-cyan-400 to-indigo-600">
      <div className="flex flex-col items-center text-center mt-10">
        {/* Profile Icon */}
        <div className="absolute top-4 left-4 cursor-pointer" onClick={goToProfile}>
          <UserCircleIcon className="h-10 ml-5 text-blue-600 hover:text-blue-950" />
        </div>

        <h1 className="text-[50px] font-semibold text-blue-900">GOD&apos;S GIFT</h1>
        <h2 className="text-3xl font-semibold text-blue-900">WATER REFILLING STATION</h2>
        <div className="mt-4 -mr-2">
          <Image src={sumImage} alt="Order Summary" className="h-full w-[500px]" />
        </div>
      </div>
      <div className="bg-white w-[550px] h-full p-5 rounded-lg shadow-2xl">
        <div className="text-3xl text-blue-900 font-semibold mb-4">Order Summary</div>
        <div className="bg-blue-200 p-5 rounded-lg">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="mb-4 text-semibold text-[20px]">
                <div>
                  <strong>Date:</strong> {order.date}
                </div>
                <div>
                  <strong>Time:</strong> {order.time}
                </div>
                <div>
                  <strong>Gallons:</strong> {order.gallon_count}
                </div>
                <div>
                  <strong>Delivery Type:</strong> {order.delivery_type}
                </div>
                <div>
                  <strong>Water Type:</strong> {order.water_type}
                </div>
                <div>
                  <strong>Total Price:</strong> ₱{order.total_price?.toFixed(2)}
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <button
                    className="bg-red-500 text-white rounded p-2 font-semibold hover:bg-red-600 active:scale-95"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleBack(orderID)}
            className="bg-blue-500 text-white text-[15px] rounded-[8px] p-2 w-[100px] font-semibold hover:bg-blue-600 active:bg-indigo-600 active:scale-95 shadow-md"
          >
            Back
          </button>
          <button
            onClick={handleOrderSummary}
            className="bg-blue-500 text-white text-[15px] rounded-[8px] p-2 w-[400px] h-[45px] font-semibold hover:bg-blue-600 active:bg-indigo-600 active:scale-95 shadow-md"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
