import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [hideNearFooter, setHideNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");

      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the button is near or overlaps with the footer
        if (footerRect.top < windowHeight) {
          setHideNearFooter(true);
        } else {
          setHideNearFooter(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      onClick={visible && !hideNearFooter ? handleClick : undefined}
      className={`fixed right-8 animate-bounce bottom-8 z-10 rounded-lg bg-blue-500 text-white p-2 transition-opacity duration-300 ease-in-out hover:bg-gray-500 hover:cursor-pointer ${
        visible && !hideNearFooter ? "opacity-100" : "opacity-0"
      }`}
    >
      <button>
        <FontAwesomeIcon className="w-4 h-4" icon={faArrowUp} />
      </button>
    </div>
  );
}
