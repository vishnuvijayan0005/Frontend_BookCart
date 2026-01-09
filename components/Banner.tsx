"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import api from "@/utils/baseUrl";
export interface Banner{
  
  url:string
}
export default function BannerSlider() {
  const[banners,setBanner]=useState<Banner[]>([])
  useEffect(()=>{
    const fetchbanner=async()=>{

      const res=await api.get("/getbanner")
      setBanner(res.data.data);
    }
fetchbanner()
  },[])
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000 }}
      loop
      pagination={{ clickable: true }}
      className="w-full h-[220px] md:h-[380px] rounded-xl overflow-hidden"
    >
      {banners.map((img) => (
        <SwiperSlide >
          <img src={img.url} className="w-full h-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
