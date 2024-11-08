// Home.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const carouselItems = [
    { id: 1, src: '/image1.jpg', alt: 'Image 1' },
    { id: 2, src: '/image2.jpg', alt: 'Image 2' },
    { id: 3, src: '/image3.jpg', alt: 'Image 3' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      {showLogin ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Welcome to Login Page</h2>
          <p className="mt-4 text-gray-600">
            Please log in to access your account.
          </p>
        </div>
      ) : (
        <div>
          {/* Carousel Section */}
          <div className="relative mt-8 shadow-lg">
            <Slider {...settings}>
              {carouselItems.map((item) => (
                <div key={item.id}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1000}
                    height={600}
                    className="object-cover w-full h-96"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* HomePage Section */}
          <section className="text-center py-20 bg-white">
            <h2 className="text-4xl font-semibold mb-4 text-blue-600">
              Welcome to Our Laundry Service
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Convenient and reliable laundry service at your doorstep. We take
              care of your laundry while you focus on what matters.
            </p>

            <Link href="/login">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                Get Started
              </button>
            </Link>
          </section>
        </div>
      )}
    </main>
  );
}
