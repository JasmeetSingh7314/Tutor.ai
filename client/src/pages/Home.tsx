import { BentoGrid } from "@/components/Home/BentoGrid";
import { Features } from "@/components/Home/Features";
import { Hero } from "@/components/Home/Hero";
import { Navbar } from "@/components/Navbar";
import React from "react";
import Footer from "@/components/Footer";

const landing = () => {
  return (
    <div className="min-h-screen bg-black text-white font-montserrat ">
      <Navbar />
      <Hero />
      <BentoGrid />
      <Features />
      <Footer />
    </div>
  );
};

export default landing;
