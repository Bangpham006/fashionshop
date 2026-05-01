import React from 'react';
import Hero from '../components/Hero/Hero';
import Featured from '../components/Featured/Featured';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Featured />
    </div>
  );
}

export default Home;