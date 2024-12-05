import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import IMGwater from '../public/angle.png'; // Adjust the path as necessary
import { UserCircleIcon } from '@heroicons/react/solid'; // For the profile icon


const Order: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedWaterType, setSelectedWaterType] = useState<string | null>(null);
    const [gallonCount, setGallonCount] = useState<number>(1); // Initialize to 1 gallon by default
    const [email, setEmail] = useState<string>(''); // Email state
    const router = useRouter();

    // Refs for form inputs
    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    const pricePerGallon = 15; // Price for a gallon of water updated to 15 pesos

    const handleProceed = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Check if all required fields are filled
        if (
            !dateRef.current?.value ||
            !timeRef.current?.value ||
            !selectedOption ||
            !selectedWaterType ||
            gallonCount < 1 ||
            !email // Check if email is provided
        ) {
            alert("Please fill in all required fields.");
            return;
        } else {
            try {
                const response = await fetch("/api/order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        date: dateRef.current.value,
                        time: timeRef.current.value,
                        gallonCount,
                        deliveryType: selectedOption,
                        waterType: selectedWaterType,
                        email,
                    }),
                });

                if (response.ok) {
                    alert('Order Placed!!');
                    router.push('/OrderSummary');
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'An error occurred while placing your order.');
                }
                
            } catch (error) {
                console.error("Failed to place the order", error);
                alert("There was an issue placing your order. Please try again.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/Login");
    };

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    };

    const handleGallonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setGallonCount(value >= 1 ? value : 1); // Ensure at least 1 gallon
    };

    const goToProfile = () => {
        router.push('/Profile'); // Redirect to the profile page
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-400 to-indigo-600 gap-40">

            {/* Profile Icon */}
            <div className="absolute top-4 left-4 cursor-pointer" onClick={goToProfile}>
                <UserCircleIcon className="h-10 ml-5 text-blue-600 hover:text-blue-950" />
            </div>

            <div className="flex flex-col items-start">
                <h1 className="text-blue-900 font-semibold text-[45px] -mt-8 ml-[120px]">GOD&apos;S GIFT</h1>
                <h2 className="text-white text-[30px] mt-1 ml-[60px]">WATER REFILLING STATION</h2>
                <p className="mt-8 ml-[58px] text-lg text-blue-950 font-semibold">&quot;Quench your Thirst, The Extraordinary Way&quot;</p>
                <div className="w-[400px] h-[400px] relative mt-5 ml-10 border-2 border-none shadow-2xl">
                    <Image src={IMGwater} alt="Water" layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105 rounded-lg"/>
                </div>
                <div className="absolute top-4 right-4">
                    <button 
                        type="button" 
                        onClick={handleLogout} 
                        className="bg-blue-600 text-white text-[14px] rounded-[8px] p-2 w-[100px] font-semibold hover:bg-blue-700 active:bg-indigo-600 active:scale-95 shadow-md text-center"
                    >
                        Log-Out
                    </button>
                </div>
            </div>

            <div className="bg-white bg-opacity-80 rounded-[10px] p-8 w-[500px] min-h-[400px] shadow-2xl">
                <h1 className="text-blue-900 text-4xl text-center font-semibold mb-4 -mt-3">MAKE YOUR ORDER</h1>
                <div className="flex justify-around mb-3 gap-5">
                    <button 
                        type="button" 
                        className={`px-4 py-2 rounded-md w-[200px] active:scale-95 ${selectedOption === 'delivery' ? 'bg-blue-500 text-white' : 'bg-blue-300'}`}
                        onClick={() => handleOptionChange('delivery')}
                    >
                        DELIVERY
                    </button>
                    <button 
                        type="button" 
                        className={`px-4 py-2 rounded-md w-[200px] active:scale-95 ${selectedOption === 'pickup' ? 'bg-blue-500 text-white' : 'bg-blue-300'}`} 
                        onClick={() => handleOptionChange('pickup')}
                    >
                        PICK-UP
                    </button>
                </div>

                <form onSubmit={handleProceed}>
                    <div className="flex mb-3 ml-1 gap-7">
                        <input type="date" ref={dateRef} className="border rounded-md p-2 w-[200px]" required />
                        <input type="time" ref={timeRef} className="border rounded-md p-2 w-[200px]" required />
                    </div>

                    {selectedOption === 'pickup' && (
                        <>
                            {/* Water Type Selection */}
                            <div className="mb-3">
                                <label htmlFor="waterType" className="block mb-1 text-blue-900 font-medium">
                                    Select Water Type
                                </label>
                                <select 
                                    id="waterType"
                                    value={selectedWaterType || ''} 
                                    onChange={(e) => setSelectedWaterType(e.target.value)} 
                                    className="border rounded-md p-2 w-full"
                                    required
                                >
                                    <option value="" disabled>Select Water Type</option>
                                    <option value="Purified Water">Purified Water</option>
                                    <option value="Mineral Water">Mineral Water</option>
                                    <option value="Distilled Water">Distilled Water</option>
                                    <option value="Alkaline Water">Alkaline Water</option>
                                </select>
                            </div>

                            {/* Pick-Up Location */}
                            <div className="mb-3">
                                <label className="block mb-1 text-blue-900 font-medium">
                                    Pick-Up Location
                                </label>
                                <a 
                                    href="https://maps.app.goo.gl/UgH5SyHRmjwohuVy7" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block border rounded-md p-2 bg-gray-200 cursor-pointer text-blue-600 underline"
                                >
                                    Zone 7, Brgy. Villarica Babak District Island Garden City of Samal
                                </a>
                            </div>
                        </>
                    )}

                    {selectedOption === 'delivery' && (
                        <select 
                            value={selectedWaterType || ''} 
                            onChange={(e) => setSelectedWaterType(e.target.value)} 
                            className="border rounded-md p-2 mb-3"
                            required
                        >
                            <option value="" disabled>Select Water Type</option>
                            <option value="Purified Water">Purified Water</option>
                            <option value="Mineral Water">Mineral Water</option>
                            <option value="Distilled Water">Distilled Water</option>
                            <option value="Alkaline Water">Alkaline Water</option>
                        </select>
                    )}

                    {/* Email Input */}
                    <div className="mb-3">
                        <label htmlFor="email" className="block mb-1 text-blue-900 font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>

                    <div className="flex flex-col items-start mb-3">
                        <input 
                            type="number" 
                            value={gallonCount} 
                            onChange={handleGallonChange} 
                            placeholder="Gallon(s)" 
                            className="border rounded-md p-2 w-full text-center mb-2" 
                            required 
                            min="1" 
                            step="1" 
                        />
                        <span className="text-blue-900 font-semibold">
                            Total Price: ₱{gallonCount * pricePerGallon}
                        </span>
                    </div>

                    <button type="submit" 
                        className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 -mt-10 active:scale-95 active:bg-indigo-600"
                    >
                        Proceed
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Order;
