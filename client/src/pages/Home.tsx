import { BentoGrid } from "@/components/Home/BentoGrid";
import { Features } from "@/components/Home/Features";
import { Hero } from "@/components/Home/Hero";
import { Navbar } from "@/components/common/Navbar";
import React from "react";
import Footer from "@/components/common/Footer";


const landing = () => {
  return (
    <div className="min-h-screen bg-black text-white font-nunito ">
      <Navbar />
      <Hero />
      <BentoGrid />
      <Features />
      <Footer />
    </div>
  );
};

export default landing;
