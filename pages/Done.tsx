import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import waterdropImage from '../public/water-drop.png';
import wallclockImage from '../public/wall-clock.png';
import drinkwaterImage from '../public/drink-water.png';

type Order = {
  id: string;
  date: string;
  time: string;
  gallon_count: number;
  total_price: number;
  water_type: string;
  email: string;
};

const Done: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.email) {
      setEmail(storedUser.email);
    } else {
      alert('User not logged in. Redirecting to login page...');
      router.push('/Login');
    }
  }, [router]);

  useEffect(() => {
    if (email) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/order?email=${email}`);
          const data = await response.json();
          if (response.ok && data.orders && data.orders.length > 0) {
            setOrder(data.orders[0]); // Assuming the first order is the latest
          } else {
            console.error('No order found.');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      };

      fetchOrder();
    }
  }, [email]);

  const handleOrderAgain = () => {
    router.push('/Order');
  };

  const handleOrderHistory = () => {
    router.push('/History');
  };

  return (
    <div className="flex flex-col min-w-full min-h-screen justify-center items-center bg-gradient-to-br from-cyan-400 to-blue-500 overflow-hidden">
      <div className="text-center mb-6 animate-fadeIn">
        <h1 className="text-5xl font-sans text-black mt-10 uppercase -mt-4 font-semibold">Thank you!</h1>
      </div>

      {/* Display Order Details Above Images and Buttons */}
      {order && (
        <div className="text-center mb-7 mt-2 animate-fadeIn">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <p>Date: {order?.date}</p>
          <p>Quantity: {order?.gallon_count} Gallons</p>
          <p>Total Amount: ₱{order?.total_price}</p>
        </div>
      )}

      {/* Display Other Content Like Images */}
      <div className="mb-4 animate-fadeIn text-center">
        <h1 className="text-2xl font-sans text-black mb-3 font-semibold">We appreciate your business with us.</h1>
        <h1 className="text-2xl font-sans text-black mb-3 font-semibold">May we provide you with refreshment.</h1>
        <h1 className="text-2xl font-sans text-black mb-3 font-semibold">Stay Cool, Stay Hydrated!</h1>
      </div>

      <div className="flex flex-row items-center justify-around w-full max-w-3xl mb-10 mt-3">
        <div className="flex flex-col items-center rounded-lg p-2 animate-fadeIn">
          <Image src={waterdropImage} alt="Water Drop" width={100} height={100} />
        </div>
        <div className="flex flex-col items-center rounded-lg p-2 animate-fadeIn">
          <Image src={wallclockImage} alt="Wall Clock" width={100} height={100} />
        </div>
        <div className="flex flex-col items-center rounded-lg p-2 animate-fadeIn">
          <Image src={drinkwaterImage} alt="Drink Water" width={100} height={100} />
        </div>
      </div>

      <div className="flex gap-10 mt-8">
        <button
          onClick={handleOrderAgain}
          className="bg-blue-500 text-black font-semibold py-3 px-20 rounded hover:bg-blue-600 active:scale-95 active:bg-indigo-600"
        >
          Order Again
        </button>
        <button
          onClick={handleOrderHistory}
          className="bg-blue-500 text-black font-semibold py-3 px-20 rounded hover:bg-blue-600 active:scale-95 active:bg-indigo-600"
        >
          Order History
        </button>
      </div>
    </div>
  );
};

export default Done;
