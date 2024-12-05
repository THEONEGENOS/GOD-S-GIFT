import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Order = {
  id: string;
  date: string;
  gallon_count: number;
  total_price: number;
  water_type: string;
  email: string;
};

const History: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState<string>("");
  const pricePerGallon = 15; 

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
    const fetchOrders = async () => {
      if (!email) return;

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
      }
    };

    fetchOrders();
  }, [email]);

  const handleBack = () => {
    router.push("/Done");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex-1 p-10 min-h-screen bg-gradient-to-br from-cyan-400 to-indigo-600">
      <h1 className="text-4xl font-bold mb-8 text-blue-950">Purchase History</h1>

      {/* Email input field for updating */}
      <div className="mb-4">
        <label htmlFor="email" className="text-white mr-2">Email:</label>
        <input
          type="email" 
          disabled
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="p-2 rounded"
        />
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Water Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Quantity (Gallons)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.water_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.gallon_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₱{order.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No order history available.</p>
      )}

      <div className="absolute top-4 right-4">
        <button
          onClick={handleBack}
          className="bg-blue-700 text-white text-[15px] rounded-[8px] p-2 w-[100px] font-semibold hover:bg-blue-600 active:bg-indigo-600 active:scale-95 shadow-md text-center"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default History;
