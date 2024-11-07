"use client";

import { Fragment, useEffect, useState } from "react";

const Preloader = () => {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 500);
  }, []);

  return (
    <Fragment>
      {loading && (
        <div id="preloader">
          <div id="loading">
            <div id="loading-center">
              <div id="loading-center-absolute">
                <div className="object" id="object_one" />
                <div className="object" id="object_two" />
                <div className="object" id="object_three" />
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default Preloader;
