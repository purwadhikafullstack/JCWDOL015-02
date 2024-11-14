'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AboutUs from '@/components/(home)/AboutUs';
import Carousel from '@/components/(home)/Carousel';
import ChooseUs from '@/components/(home)/ChooseUs';
import Contact from '@/components/(home)/Contact';
import HowToOrder from '@/components/(home)/HowToOrder';
import Testimonial from '@/components/(home)/Testimonial';
import { useState } from 'react';
export default function Home() {
  const [showLogin, setShowLogin] = useState(false); // State untuk menampilkan LoginPage jika diperlukan

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

  // Fungsi untuk menampilkan LoginPage saat tombol login diklik
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center">
      <Carousel />
      <AboutUs />
      <ChooseUs />
      <HowToOrder />
      <Testimonial />
      <Contact />
    </main>
  );
}
