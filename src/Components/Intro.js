import { useEffect, useState } from "react";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import { ReactTyped as Typed } from "react-typed";
import { Link } from "react-router-dom";

const images = [image2, image3];

const Intro = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen pt-24">
      <div className="w-full h-screen overflow-hidden">
        <img
          src={images[index]}
          alt={`slide-${index}`}
          className="w-full h-full object-cover object-center transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 md:px-12">
        <p className="text-orange-500 font-bold mb-4 text-lg md:text-2xl tracking-wide uppercase">
          Your Fitness Journey Starts Here
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-snug">
          Push your limits, transform your body <br /> and unlock your full potential
        </h1>

        <div className="font-bold text-xl md:text-2xl text-orange-500 mb-6">
          <Typed
            strings={["Transform Your Body Now", "Join FitVerse Today"]}
            typeSpeed={60}
            backSpeed={50}
            loop
          />
        </div>

        <p className="text-white text-lg md:text-xl font-semibold mb-8 max-w-2xl">
          The Future of Fitness Starts Here – Personalized Programs, Expert Guidance, Real Results.
        </p>

        <Link to="/login">
          <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Intro;
