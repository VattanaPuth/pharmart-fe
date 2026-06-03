import React from "react";
import Image from "next/image";

const notfound = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 py-10 text-gray-700">
        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <div className="max-w-md mx-auto md:mx-0 text-center md:text-left">
            <div className="text-4xl md:text-5xl font-bold">404</div>

            <p className="text-xl md:text-3xl font-light leading-normal mt-2">
              Sorry we couldn't find this page.
            </p>

            <p className="mb-8 mt-2">
              But don't worry, you can find plenty of other things on our
              homepage.
            </p>

            <button className="px-6 py-3 font-medium text-white rounded-lg bg-[#F06292] hover:bg-pink-700 transition">
              Back to homepage
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 relative flex justify-center items-center overflow-hidden bg-teal-500 min-h-87.5 md:min-h-125 rounded-xl">
          {/* Rays */}
          <div className="absolute inset-0 flex">
            {[
              "#AFE0E4",
              "#C0E6E9",
              "#84CDD4",
              "#7EC9D1",
              "#97D6DC",
              "#AEDEE2",
              "#96D3D8",
              "#9CD7DD",
              "#7ECBD3",
              "#AFE0E4",
            ].map((color, index) => (
              <div
                key={index}
                className="flex-1 h-full animate-ray"
                style={{
                  backgroundColor: color,
                  opacity: 0.2,
                  animationDelay: `${index * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Bubbles */}
          <div className="absolute top-0 left-[20%] w-2 h-24 bg-white/30 rounded-full animate-fall"></div>
          <div className="absolute top-8 left-[35%] w-2 h-24 bg-white/30 rounded-full animate-fall"></div>
          <div className="absolute top-16 left-[50%] w-2 h-24 bg-white/30 rounded-full animate-fall"></div>
          <div className="absolute top-24 left-[65%] w-2 h-24 bg-white/30 rounded-full animate-fall"></div>
          <div className="absolute top-32 left-[80%] w-2 h-24 bg-white/30 rounded-full animate-fall"></div>

          {/* Otter */}
          <Image
            src="/otter-svgrepo-com.svg"
            alt="otter"
            width={300}
            height={300}
            className="relative z-10 w-40 md:w-60 lg:w-80"
          />
        </div>
      </div>
    </div>
  );
};

export default notfound;
