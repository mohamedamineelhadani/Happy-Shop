import React, { useEffect, useRef, useState } from "react";
import "./Slider.css";
import slid1 from "./../assets/images/slid1.jpg";
import slid2 from "./../assets/images/slid2.jpg";
import slid3 from "./../assets/images/slid3.jpg";

const Slider = () => {
  const images = [slid1,slid2,slid3];

  const cards = useRef(null);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (cards.current) {
      const card = cards.current.querySelector(".card");
      if (card) setCardWidth(card.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (cards.current) {
      cards.current.style.transform = `translateX(-${index * cardWidth}px)`;
      cards.current.style.transition = "transform 0.5s ease";
    }
  }, [index, cardWidth]);

  const right = () => {
    if (index < images.length - 1) setIndex(index + 1);
  };

  const left = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="slider">
      <div className="slider-text">
        <h1 className="slider-title">HappyShop</h1>
        <p className="slider-comment">Best place to shop</p>
      </div>
      <div className="cards" ref={cards}>
        {images.map((img, i) => (
          <div className="card" key={i}>
            <img src={img} alt={`slider ${i}`} />
          </div>
        ))}
      </div>

      <button className="right-btn btn-p" onClick={right}>
        &#10095;
      </button>
      <button className="left-btn btn-p" onClick={left}>
        &#10094;
      </button>

      <div className="steps" id="steps">
        {images.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
