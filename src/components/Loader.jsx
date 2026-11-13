import React, { useEffect, useRef, useState } from "react";
import "./Loader.css";
const Loader = () => {
  const [loader, setLoader] = useState(0);
  const loaderDiv = useRef(null);

  useEffect(() => {
    const images = document.images;
    const totalImages = images.length;
    let loadedImages = 0;

    if (totalImages === 0) {
      hideLoader();
    }

    for (let i = 0; i < totalImages; i++) {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedImages++;
       
        const percent = Math.floor((loadedImages / totalImages) * 100);
        setLoader(percent)

        if (loadedImages === totalImages) {
          hideLoader();
        }
      };
      img.src = images[i].src;
    }

    function hideLoader() {
      loaderDiv.current.style.opacity = "0";
      setTimeout(() => {
      loaderDiv.current.style.display = "none";
      }, 500);
    }
  }, []);

  return (
    <div id="loader" ref={loaderDiv}>
      <div className="loader-content">
        <div className="spinner"></div>
        <div id="loaderText">{loader}%</div>
      </div>
    </div>
  );
};

export default Loader;
