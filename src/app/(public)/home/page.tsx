import React from "react";
import Navbar from "./_components/navbar";
import HeroPage from "./_components/hero";
import ContentPage from "./_components/content";
import Footer from "./_components/footer";
import LandingPage from "./_components/landing-page";

const Homepage = () => {
  return (
    <div className="bg-primary text-secondary">
      <Navbar />
      <HeroPage />
      <ContentPage />
      <Footer />

      {/* <LandingPage /> */}
    </div>
  );
};

export default Homepage;
