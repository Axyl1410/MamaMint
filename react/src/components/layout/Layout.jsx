import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "../common/BackToTopButton";
const Layout = () => {
  //   const [darkMode, setDarkMode] = useState(false);

  //   const toggleDarkMode = () => {
  //     setDarkMode((prevMode) => !prevMode);
  //     document.body.classList.toggle("dark");
  //   };

  return (
      <div className="relative h-full">
          <div className="absolute inset-0">
              <div
                  className="absolute top-0 z-[-2] min-h-full w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
          </div>

          {/*<div className="relative z-10 flex h-full flex-col items-center justify-center px-4">*/}
              <div className="ext-center">
                  <Navbar/>
                  <div className=" w-screen flex justify-center min-h-[100vh] z-[50]">
                      <Outlet/>
                  </div>
                  <BackToTopButton/>
                  <Footer/>
                  {/*<h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white">*/}
                  {/*    Your Next Great*/}
                  {/*    <span className="text-sky-400">Project</span>*/}
                  {/*</h1>*/}
                  {/*<p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">*/}
                  {/*    Build modern and beautiful websites with this collection of stunning background patterns.*/}
                  {/*    Perfect for landing pages, apps, and dashboards.*/}
                  {/*</p>*/}
                  {/*<div className="flex flex-wrap justify-center gap-4">*/}
                  {/*    <button className="rounded-lg px-6 py-3 font-medium bg-sky-400 text-slate-900 hover:bg-sky-300">*/}
                  {/*        Get Started*/}
                  {/*    </button>*/}
                  {/*    <button*/}
                  {/*        className="rounded-lg border px-6 py-3 font-medium border-slate-700 bg-slate-800 text-white hover:bg-slate-700">*/}
                  {/*        Learn More*/}
                  {/*    </button>*/}
                  {/*</div>*/}
              {/*</div>*/}
          </div>
      </div>
)
    ;
};

export default Layout;
