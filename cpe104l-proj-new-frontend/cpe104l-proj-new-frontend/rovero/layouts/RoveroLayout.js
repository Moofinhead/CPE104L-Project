"use client";
import EmbedPopup from "@/components/EmbedPopup";
import { niceSelect } from "@/utility/nice-select";
import { roveroUtility } from "@/utility/roveroUtility";
import { Fragment, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Scroll from "./Scroll";

const RoveroLayout = ({ children, homeClass }) => {
  useEffect(() => {
    roveroUtility.animation();
    roveroUtility.bgImage();
  }, []);

  return (
    <Fragment>
      <EmbedPopup />
      <Header homeClass={homeClass} />
      {children}
      <Footer />
      <div className="scroll-up">
        <a href="#top">
          <i className="fas fa-arrow-up"></i>
        </a>
      </div>
    </Fragment>
  );
};

export default RoveroLayout;