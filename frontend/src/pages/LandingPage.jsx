import LPimg1 from "../assets/img/HBCafeLandingPage-img1.jpg"
import LPimg2 from "../assets/img/HBCafeLandingPage-img2.png";
import LPimg2b from "../assets/img/HBCafeLandingPage-img2(w).png";
import LPimg3 from "../assets/img/HBCafeLandingPage-img3.jpg";
import LPimg4 from "../assets/img/HBCafeLandingPage-img4.jpg";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";


const LandingPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Monitor window size and toggle between layouts
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed (e.g., 768px for mobile)
    };

    handleResize(); // Set initial state based on current screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  return (
    <div>
      {isMobile ? (
        // Layout for Mobile
        <div className="h-170 bg-no-repeat bg-center text-white font-serif"
          style={{
            backgroundImage: `url(${LPimg1})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="b-zinc-800/50">
            <img src={LPimg2b} alt="" className="w-auto h-auto max-w-full" />
          </div>

          <div className="bg-zinc-800/75 min-h-[20em] px-6 py-4">
            <h2 className="text-2xl text-center font-semibold">About Us</h2>
            <div className="text-justify text-xl mt-3">
              "HypeBeans", a cafe situated in Donacion, Angat, Bulacan, is a cafe created through hardship and perseverance to achieve the owner's dreams. . . .
            </div>
            <button className="mt-4 font-serif text-white w-32 p-2 bg-zinc-900 rounded-2xl">
              <Link to="/about">Read More...</Link>
            </button>
          </div>

          <div className="min-h-[10em] bg-zinc-900 pb-[2em]">
            <div className="h-[2.5em] text-white text-center text-3xl font-serif font-semibold tracking-widest">
              Our Products
            </div>
            <div className="h-50 grid grid-cols-[5fr_5fr] text-xl font-serif font-semibold tracking-widest text-center text-white">
              <Link
                to="/products/beverages"
                className="bg-gray-600 w-3/4 mx-auto rounded-xl"
                style={{
                  backgroundImage: `url(${LPimg3})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="size-full bg-gray-900/50 content-center">Beverages</div>
              </Link>
              <Link
                to="/products/delights"
                className="bg-gray-600 w-3/4 content-center mx-auto rounded-xl"
                style={{
                  backgroundImage: `url(${LPimg4})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="size-full bg-gray-900/50 content-center">Delights</div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Layout for Desktop
        <div>
          <div className="grid grid-cols-[5fr_5fr] h-170 pt-2 overflow-hidden">
            <div className="bg-zinc-600 h-full overflow-hidden">
              <img src={LPimg1} alt="" className="-translate-y-6" />
            </div>
            <div className="h-full">
              <img src={LPimg2} alt="" className="-translate-y-8" />
            </div>
          </div>

          <div className="grid grid-cols-[5fr_5fr] h-130 pt-2 overflow-hidden bg-gray-400/25">
            <div className="h-full overflow-hidden px-10 pt-20">
              <h2 className="font-serif text-4xl font-bold">About Us</h2>
              <p className="mt-5 font-serif tracking-wide text-justify text-3xl font-light">
                "HypeBeans", a cafe situated in Donacion, Angat, Bulacan, is a cafe created through hardship and perseverance to achieve the owner's dreams. . . .
              </p>
              <button className="mt-4 font-serif text-white w-32 p-2 bg-zinc-900 rounded-2xl">
                <Link to="/about">Read More...</Link>
              </button>
            </div>
            <div className="h-full flex justify-center items-center">
              <div className="bg-zinc-900 text-white font-mono font-black text-7xl text-center h-3/4 w-3/4 content-center rounded-4xl">
                "HYPEBEANS"
              </div>
            </div>
          </div>

          <div className="min-h-[30em] bg-zinc-900 pb-[5em]">
            <div className="h-[5em] text-white text-center content-center text-4xl font-serif font-semibold tracking-widest">
              Our Products
            </div>
            <div className="h-80 grid grid-cols-[5fr_5fr] text-3xl font-serif font-semibold tracking-widest text-center text-white">
              <Link
                to="/products"
                className="bg-gray-600 w-1/2 mx-auto rounded-xl"
                style={{
                  backgroundImage: `url(${LPimg3})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="size-full bg-gray-900/50 content-center">Beverages</div>
              </Link>
              <Link
                to="/products"
                className="bg-gray-600 w-1/2 content-center mx-auto rounded-xl"
                style={{
                  backgroundImage: `url(${LPimg4})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="size-full bg-gray-900/50 content-center">Delights</div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;