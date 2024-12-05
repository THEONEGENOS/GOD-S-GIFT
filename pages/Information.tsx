import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import one from '../public/1.jpg';
import two from '../public/2.jpg';
import three from '../public/3.jpg';
import four from '../public/4.jpg';
import five from '../public/5.jpg';
import Mineral from '../public/mineral.jpg';
import Mineralwater from '../public/mineral(1).jpg';
import Angle from '../public/angle.png';
import Distilled from '../public/distilled.jpg';
import Distilledwater from '../public/Distilled(1).jpg';
import Alkaline from '../public/alkaline.jpg';
import Alkalinewater from '../public/alkaline(1).jpg';
import { UserCircleIcon } from '@heroicons/react/solid'; // For the profile icon



const imageDetails = [
    { src: one, text: "GOD'S GIFT Water Refilling Station was established on March 4, 2019." },
    { src: two, text: "We offer Purified Water for all your Hydration needs." },
    { src: three, text: "We conduct Water Sampling every first week of the month to ensure a Clean and High Quality water supply." },
    { src: four, text: "GOD'S GIFT Water Refilling Station is DOH Certified." },
    { src: five, text: "We are located at Zone 7, Brgy. Villarica  Babak District Island Garden City of Samal." },
];

const Information: React.FC = () => {
    const router = useRouter();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleProceed = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push('/Order');
    };

    const goToProfile = () => {
        router.push('/Profile'); // Redirect to the profile page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-400 to-indigo-600">
            <div className="text-center mb-10">

            {/* Profile Icon */}
            <div className="absolute top-4 left-4 cursor-pointer" onClick={goToProfile}>
                <UserCircleIcon className="h-10 ml-5 text-blue-600 hover:text-blue-950" />
            </div>

                <h1 className="text-5xl text-blue-900 mt-10 font-semibold">GOD&apos;S GIFT</h1>
                <h2 className="text-4xl mt-2 font-normal text-white">WATER REFILLING STATION</h2>
            </div>
            <div className="mb-4">
                <p className="text-lg font-semibold text-blue-950 -mt-2 mb-5">&quot;We provide Pure and Clean water for all your Hydration needs&quot;</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-10">
                {imageDetails.map((image, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-md shadow-2xl transition-transform transform hover:scale-110 ${hoveredIndex !== null && hoveredIndex !== index ? 'filter blur-sm' : ''}`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Image 
                            src={image.src} 
                            alt={`Image ${index + 1}`} 
                            width={160}
                            height={120}
                            className="object-cover w-full h-full" 
                        />
                        {hoveredIndex === index && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-2 text-center">
                                {image.text}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center mb-20">
                <p className="text-5xl font-semibold text-blue-900 mb-4">Mineral Water</p>
                <p className='text-lg font-semibold text-white mb-5'>Mineral water is also known as spring water because it comes from natural springs</p>
                <div className="flex gap-8">
                    <div className="relative overflow-hidden rounded-md shadow-2xl">
                        <Image 
                            src={Mineral}
                            alt="Mineral Water"
                            width={300} // Increased size
                            height={200} // Increased size
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="relative overflow-hidden rounded-md shadow-2xl">
                        <Image 
                            src={Mineralwater}
                            alt="Mineral Water"
                            width={300} // Increased size
                            height={200} // Increased size
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mb-20">
                <p className="text-5xl font-semibold text-blue-900 mb-4">Purified Water</p>
                <p className='text-lg font-semibold text-white mb-5'>Purified water is usually produced by the purification of drinking water or ground water</p>
                <div className="flex gap-8">
                    <div className="relative overflow-hidden rounded-md shadow-2xl">
                        <Image 
                            src={Angle}
                            alt="Mineral Water"
                            width={300} // Increased size
                            height={200} // Increased size
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="relative overflow-hidden rounded-md shadow-2xl">
                        <Image 
                            src={one}
                            alt="Mineral Water"
                            width={300} // Increased size
                            height={200} // Increased size
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mb-20">
                <p className="text-5xl font-semibold text-blue-900 mb-4">Distilled Water</p>
                <p className='text-lg font-semibold text-white mb-5'>distilled water is produced by boiling water and then condensing the collected steam back into a liquid</p>
                <div className="flex gap-8">
                    <div className="relative overflow-hidden rounded-md shadow-2xl">
                        <Image 
                            src={Distilled}
                            alt="Mineral Water"
                            width={300} // Increased size
                            height={200} // Increased size
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="relative overflow-hidden rounded-md shadow-2xl">
                        <Image 
                            src={Distilledwater}    
                            alt="Mineral Water"
                            width={300} // Increased size
                            height={200} // Increased size
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mb-20">
    <p className="text-5xl font-semibold text-blue-900 mb-4">Alkaline Water</p>
    <p className="text-lg font-semibold text-white mb-5">Water that&apos;s naturally alkaline occurs when it passes over rocks — like springs — and picks up minerals, which increase its alkaline level</p>
    <div className="flex gap-8">
        <div className="relative overflow-hidden rounded-md shadow-2xl">
            <Image
                src={Alkaline}
                alt="Alkaline Water"
                width={300}
                height={200}
                className="object-cover w-full h-full"
            />
        </div>
        <div className="relative overflow-hidden rounded-md shadow-2xl">
            <Image
                src={Alkalinewater}
                alt="Alkaline Water"
                width={300}
                height={200}
                className="object-cover w-full h-full"
            />
        </div>
    </div>
</div>

            <div className="fixed bottom-[60px] right-24">
                <button
                    onClick={handleProceed}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg transition-transform transform hover:bg-blue-600 active:scale-95 active:bg-blue-900"
                >
                    Proceed to Order
                </button>
            </div>
        </div>
    );
};

export default Information;
