import React from 'react';
import Hero from '../components/Hero';
import Featured from '../components/Featured'; // Thêm dòng này

function Home() {
  return (
    <div className="home-page">
      <Hero />
      
      {/* Thay thế phần div cũ bằng component Featured */}
      <Featured />

      {/* Bạn có thể thêm các phần khác sau này như:
      <NewArrivals />
      <Footer /> 
      */}
    </div>
  );
}

export default Home;