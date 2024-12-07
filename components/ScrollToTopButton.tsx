// "use client";
// import { useCallback, useEffect, useState } from "react";

// const ScrollToTopButton = ({ threshold = 300 }: { threshold?: number }) => {
//   const [shown, setShown] = useState(false);
//   useEffect(() => {
//     const scrollCallback = () => {
//       const scrolledFromTop = window.scrollY;
//       setShown(() => scrolledFromTop > threshold);
//     };
//     window.addEventListener("scroll", scrollCallback);
//     scrollCallback();
//     return () => {
//       window.removeEventListener("scroll", scrollCallback);
//     };
//   }, []);
//   const scrollToTop = useCallback(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   return (
//     <button
//       aria-label="scroll to top"
//       onClick={scrollToTop}
//       className={`${
//         shown ? "scale-100" : "scale-0"
//       } w-12 h-12 transition-transform duration-200 flex fixed right-10 bottom-10 bg-primary rounded-full shadow-lg shadow-gray-900 justify-center items-center`}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={2}
//         stroke="currentColor"
//         className="w-6 h-6"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M4.5 15.75l7.5-7.5 7.5 7.5"
//         />
//       </svg>
//     </button>
//   );
// };

// export default ScrollToTopButton;

"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
const ScrollToTopButton = ({ threshold = 300 }: { threshold?: number }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const scrollCallback = () => {
      const scrolledFromTop = window.scrollY;
      setShown(() => scrolledFromTop > threshold);
    };
    window.addEventListener("scroll", scrollCallback);
    scrollCallback();
    return () => {
      window.removeEventListener("scroll", scrollCallback);
    };
  }, []);
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <button
      aria-label="scroll to top"
      onClick={scrollToTop}
      className={`${
        shown ? "scale-100" : "scale-0"
      } p-4 rounded-full md:w-16 md:h-16 h-12 w-12 bg-rose-200 border-rose-300 transition-transform duration-200 flex items-center justify-center`}
    >
      <ChevronUp className="w-6 h-6 text-gray-900" />
    </button>
  );
};

export default ScrollToTopButton;
