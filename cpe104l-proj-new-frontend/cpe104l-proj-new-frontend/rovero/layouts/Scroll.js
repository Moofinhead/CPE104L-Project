"use client";
import { roveroUtility } from "@/utility/roveroUtility";
import { useEffect } from "react";

const Scroll = () => {
  useEffect(() => {
    roveroUtility.scrollBtn();
  }, []);

  return (
    <div id="scroll" className="scroll-up">
      <div className="top text-center">
        <span className="white-bg theme-color d-block">
          <i className="fa-solid fa-angles-up" />
        </span>
      </div>
    </div>
  );
};
export default Scroll;
