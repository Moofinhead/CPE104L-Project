import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const GetBgImage = (imagePath) => {
  const [bgImage, setBgImage] = useState(imagePath); // initial image path
  const router = useRouter(); // get current router instance

  useEffect(() => {
    setBgImage(`${imagePath}?${Date.now()}`); // add timestamp to image
  }, [router.pathname]); // re-run only on path change

  return bgImage; // return the updated image path
};

export default GetBgImage;