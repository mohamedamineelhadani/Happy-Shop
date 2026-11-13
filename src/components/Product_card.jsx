import { useState } from "react";
import "./Product.css";


const Message = ({ txt }) => {
  return <div className="message">{txt}</div>;
};

const Product_card = ({product ,addProduct }) => {

  const [message, setMessage] = useState(false);

  function add(p){
    setMessage(true);
    setTimeout(() => {
      setMessage(false);
    }, 2000);
    addProduct(p)
  }

  const stars =
    "★".repeat(Math.round(product.rating.rate)) +
    "☆".repeat(5 - Math.round(product.rating.rate));
  return (
    <>
      <div className="product-card box" key={product.id} id={product.id} >
        {message ? <Message txt={"Is add to card"} /> : <></>}
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <div className="product-price">{product.price}$</div>
          <div className="product-category">{product.category}</div>
          <div className="product-rating">
            <span className="stars">{stars}</span>
            <span className="reviews">({product.rating.count} reviews)</span>
          </div>
          <p className="product-description">{product.description}</p>
          <button
            className="buy-button btn-p"
            onClick={() => add(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default Product_card;
