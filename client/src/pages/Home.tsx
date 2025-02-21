import { BentoGrid } from "@/components/BentoGrid";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import React from "react";

const landing = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <BentoGrid />
      <Features />
    </div>
  );
};

export default landing;
