'use client'
import Image from "next/image";
import Navbar from "@/components/navbar";
import CommitteeHeads from "@/components/committeeHeads";
import Homeview from "@/components/homeview";
import Goal from "@/components/goal";
import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
// import './styles.css'; 
// import required modules
import { EffectFade, Autoplay,FreeMode, Navigation,Thumbs, Pagination } from 'swiper/modules';
import Footer from "@/components/footer";
import Homenav from "@/components/homenav";




export default function Home() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [firstview, setFirstview] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setFirstview(false);
    },10000)
  })
  return (
    <div className=" relative"   title="cpcportal_home">
      <Navbar />
      <Homeview />
      <div className='w-full aspect-[2.9/1] flex justify-center items-center'>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        effect={'fade'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay, EffectFade]}
        className="mySwiper2 h-full w-full"
      >
        
            {/* {
              firstview &&
              <SwiperSlide
              className="w-full h-full "
            >
              <div className="h-full flex justify-center items-center">

              <p className='text-white text-4xl w-max'>
                Welcome to DIU Computer Programming Club
            </p>
              </div>
            </SwiperSlide>
            } */}
       {
          Array.from({ length: 7 }).map((_, index) => (
            <SwiperSlide
              key={index}
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('/${index + 1}.jpg')` }}
            >
            </SwiperSlide>
          ))
        }
        
      </Swiper>
      
      
       
      </div>
      <Swiper
        onSwiper={setThumbsSwiper}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper h-28"
      >
        {
          Array.from({ length: 7 }).map((_, index) => (
            <SwiperSlide
              key={index}
              className={`w-full h-full bg-cover bg-center`}
              style={{ backgroundImage: `url('/${index + 1}.jpg')` }}
            >
              {/* Additional content can go here if needed */}
            </SwiperSlide>
          ))
        }
      </Swiper>
      <div className="bg-white w-full h-full pt-6">
      <Goal />
      <CommitteeHeads />
      <Homenav />
      </div>
      <Footer />
    </div>
    
  );
}
