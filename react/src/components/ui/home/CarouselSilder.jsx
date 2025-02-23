import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function CarouselSlider() {
  const slides = [
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHHaF9Xb7bJUTJKym801f5aqbq3JN7qcwyWQ&s",
      title: "MMZ Last Tango",
      description:
        "Last Tango presents the final iterations of mimizu - works that evolved from the qubibi’s 'hello world' (2010) algorithm yet depart radically from their origin.",
    },
    {
      image: "https://mammothon.celestia.org/images/bg.png",
      title: "Another Artwork",
      description:
        "This is another piece of artwork description that changes based on slide.",
    },
    // Add more slides if needed
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[480px] w-full overflow-hidden">
      {/* Background Image with transition */}
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out  `}
      >
        <img
          src={slides[currentSlide].image}
          alt="Abstract art background"
          className="w-full h-full"
        />
      </div>

      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-20 flex top-1/3 items-center justify-between px-10">
        <button
          onClick={prevSlide}
          className="bg-white text-black rounded-full px-4 py-2 text-lg"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white text-black rounded-full px-4 py-2 text-lg"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Text Content with transition */}
      <div className="absolute bottom-4 w-full px-8 md:px-16 lg:px-32 pb-8">
        <div className="flex items-center mb-4">
          <img
            src="https://placehold.co/30x30"
            alt="qubibi logo"
            className="w-8 h-8 mr-2"
          />
          <span className="text-white text-lg">qubibi</span>
        </div>
        <h1 className="text-white text-2xl md:text-2xl lg:text-4xl font-bold mb-4">
          {slides[currentSlide].title}
        </h1>
        <div className="flex flex-row justify-between items-center">
          <p className="text-white text-sm md:text-sm lg:text-sm mr-8">
            {slides[currentSlide].description}
          </p>
          <button className="bg-white text-black text-base px-12 font-medium w-60 py-2 rounded-lg hover:bg-gray-200 transition-all">
            Collect
          </button>
        </div>
      </div>
    </div>
  );
}
