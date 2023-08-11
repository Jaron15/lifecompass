"use client";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signInAsync } from "../../redux/user/userSlice";

function page() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [signinError, setSigninError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    const action = await signIn(email, password);

    if (signInAsync.fulfilled.match(action)) {
      router.push("./");
      console.log("successful!!");
    } else {
      if (action.payload) {
        setSigninError(action.payload.error);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-[#E2E8F0] dark:bg-black flex items-center justify-center px-5 py-5">
      <div className="bg-boxdark text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden border max-w-[1000px]">
        <div className="md:flex w-full">
          <div className="hidden md:flex w-1/2 bg-white dark:bg-boxdark py-10 px-10 text-center items-center justify-center">
            <motion.div
              animate={{ rotate: 20 }}
              transition={{
                duration: 3.75,
                type: "spring",
                bounce: ".30",
                delay: 0.75,
              }}
            >
              <Image
                alt="compass"
                className="hidden dark:block h-5/6 w-full"
                src="/CompassWhite.png"
                width="1500"
                height="1500"
              />
            </motion.div>
            <motion.div
              animate={{ rotate: 20 }}
              transition={{
                duration: 3.75,
                type: "spring",
                bounce: ".30",
                delay: 0.75,
              }}
            >
              <Image
                alt="compass"
                className="bl dark:hidden h-5/6 w-full"
                src="/Compassblack.png"
                width="1500"
                height="1500"
              />
            </motion.div>
          </div>
          <form
            className="w-full md:w-1/2 py-10 px-5 md:px-10 dark:bg-boxdark bg-white"
            onSubmit={handleSubmit}
          >
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-black dark:text-[#e9e9e8]">
                Sign In
              </h1>
              <p className="text-black dark:text-[#98A1AC]">
                Dive back into your personalized experience{" "}
              </p>
            </div>
            <div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label className="text-xs font-bold px-1 text-black dark:text-[#e9e9e8]">
                    Email
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <svg
                        fill="#000000"
                        viewBox="0 0 1920 1920"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M0 1694.235h1920V226H0v1468.235ZM112.941 376.664V338.94H1807.06v37.723L960 1111.233l-847.059-734.57ZM1807.06 526.198v950.513l-351.134-438.89-88.32 70.475 378.353 472.998H174.042l378.353-472.998-88.32-70.475-351.134 438.89V526.198L960 1260.768l847.059-734.57Z"
                            fillRule="evenodd"
                          ></path>{" "}
                        </g>
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="w-full -ml-10 pl-10 !text-black pr-3 py-2 rounded-lg border-2 outline-none border-[#E2E8F0] focus:border-primary"
                      placeholder="johnsmith@example.com"
                    />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-12">
                  <label className="text-xs font-bold px-1 text-black dark:text-[#e9e9e8]">
                    Password
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        height="25"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M21 8.5V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V11C3 12.1046 3.89543 13 5 13H10.875M19 14V12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12V14M14 20H20C20.5523 20 21 19.5523 21 19V15C21 14.4477 20.5523 14 20 14H14C13.4477 14 13 14.4477 13 15V19C13 19.5523 13.4477 20 14 20Z"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>{" "}
                          <circle
                            cx="7.5"
                            cy="8.5"
                            r="1.5"
                            fill="#000000"
                          ></circle>{" "}
                          <circle
                            cx="12"
                            cy="8.5"
                            r="1.5"
                            fill="#000000"
                          ></circle>{" "}
                        </g>
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      className="w-full text-black -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 outline-none border-[#E2E8F0] focus:border-primary"
                      placeholder="************"
                    />
                  </div>
                </div>
              </div>
              {signinError && (
                <div className="flex -mx-3">
                  <div className="w-full mb-5">
                    <p className="text-red-500 text-center">{signinError}</p>
                  </div>
                </div>
              )}
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <button
                    type="submit"
                    className="block w-full max-w-xs mx-auto bg-primary hover:bg-highlight focus:bg-highlight text-white rounded-lg px-3 py-3 font-semibold"
                  >
                    SIGN IN NOW
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default page;
