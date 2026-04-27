import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

// 1. Import đầy đủ 3 ảnh từ thư mục image
import lifestyleImg from '../../image/lifestyle.jpg';
import sportImg from '../../image/sport.jpg';
// import accessoriesImg from '../image/lifestyle1.jpg'; // Dùng lifestyle1 cho mục phụ kiện

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // 2. Cấu hình nội dung cho 3 Banner
  const bannerData = [
    {
      id: 1,
      image: sportImg,
      subTitle: "Performance & Training",
      title: "ELITE SPORT GEAR",
      type: "sport"
    },
    {
      id: 2,
      image: lifestyleImg,
      subTitle: "Classic Comfort",
      title: "MODERN ESSENTIALS",
      type: "lifestyle"
    },
    // {
    //   id: 3,
    //   image: accessoriesImg,
    //   subTitle: "Complete Your Look",
    //   title: "THE FINAL TOUCH",
    //   type: "accessories"
    // }
  ];

  return (
    <section className="hero-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true} // Thêm vòng lặp để slide mượt mà hơn
      >
        {bannerData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="hero-slide-item">
              <div className="hero-image-wrapper">
                <img src={item.image} alt={item.title} className="hero-img" />
              </div>
              <div className="hero-content">
                <p className="hero-sub-title">{item.subTitle}</p>
                <h1 className="hero-main-title">{item.title}</h1>
                <button
                  className="btn-black"
                  onClick={() => navigate(`/products?type=${item.type}`)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;