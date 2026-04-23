import React from 'react';
import Hero from '../components/Hero';
import Featured from '../components/Featured'; 

function Home() {
  return (
    <div className="home-page">
      <Hero />

      <Featured />

      
    </div>
  );
}

export default Home;