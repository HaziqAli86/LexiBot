"use client";
import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black antialiased overflow-x-hidden">
      <Navbar />

      {/* VORTEX HERO SECTION */}
      <div className="w-full mx-auto h-screen overflow-hidden">
        <Vortex
          backgroundColor="black"
          // --- FINE-TUNED VORTEX SETTINGS ---
          particleCount={500}
          baseHue={220}         // Blue/Purple theme
          rangeY={800}          // How far particles spread vertically
          baseSpeed={0.1}       // Slower base speed
          rangeSpeed={0.15}     // Less variation in speed
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-7xl font-bold mt-20 md:mt-0">
               Intelligent AI <br /> for the Modern Era
            </h1>
            <p className="text-white text-sm md:text-xl max-w-xl mt-6 mx-auto">
              Experience the raw power of the Llama 3.1 8B model. 
              Hosted securely on AWS Cloud with realtime document analysis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href={user ? "/chat" : "/login"}>
                  <Button 
                      size="lg" 
                      className="px-8 py-6 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-full text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] text-lg"
                  >
                      {user ? "Let's Chat" : "Get Started"} 
                      {user ? (
                          <MessageSquare className="ml-2 h-5 w-5"/>
                      ) : (
                          <ArrowRight className="ml-2 h-5 w-5"/>
                      )}
                  </Button>
              </Link>
              <Link href="#features">
                  <Button size="lg" variant="ghost" className="px-8 py-6 text-white hover:bg-white/10 rounded-full text-lg border border-white/20">
                      Learn More
                  </Button>
              </Link>
            </div>
          </div>
        </Vortex>
      </div>

      <div id="features">
        <FeaturesGrid />
      </div>

      <Footer />
    </div>
  );
}