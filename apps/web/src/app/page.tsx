'use client'; // Menandai komponen ini sebagai Client Component

import Image from 'next/image';
import styles from './page.module.css';
import LoginPage from '../pages/LoginPage';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);

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

  return (
    <main className={styles.main}>
      <LoginPage /> {/* Menampilkan komponen LoginPage */}
      <div className={styles.carouselContainer}>
        <h2>Laundry</h2>
        <Slider {...settings}>
          {carouselItems.map((item) => (
            <div key={item.id} className={styles.slide}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={400}
                  priority
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </main>
  );
}
