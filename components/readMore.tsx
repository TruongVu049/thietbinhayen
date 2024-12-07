"use client";
import { MinusCircle, PlusCircle } from "lucide-react";
import React, { useRef, useState } from "react";

const ReadMore = ({ children }: { children: React.ReactNode }) => {
  const [isReadMore, setIsReadMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
    if (contentRef.current) {
      const topPosition =
        contentRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: topPosition - 200, // Trừ đi 200px so với vị trí hiện tại
        behavior: "smooth", // Hiệu ứng cuộn mượt mà
      });
    }
  };

  // Sử dụng useEffect để cuộn lên khi isReadMore = false
  //   useEffect(() => {}, [isReadMore]); // Theo dõi thay đổi của isReadMore

  return (
    <div
      ref={contentRef}
      className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
        isReadMore ? "h-auto" : "max-h-32"
      }`}
    >
      {children}
      <div
        className={`${
          isReadMore ? "static" : "absolute"
        } bottom-0 left-0 right-0 transition-opacity duration-300 ease-linear`}
      >
        <div
          className={`${
            isReadMore ? "h-auto" : "h-32"
          } relative w-full flex items-end bg-custom-gradient`}
        >
          <button
            onClick={toggleReadMore}
            className="py-3 px-6 hover:bg-gray-300 rounded-xl flex items-center gap-3 mx-auto bg-gray-200 justify-center transition-transform duration-300"
          >
            {!isReadMore ? (
              <PlusCircle className="w-5 h-5 text-gray-800" />
            ) : (
              <MinusCircle className="w-5 h-5 text-gray-800" />
            )}
            {isReadMore ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadMore;
