import React, { useEffect, useState } from "react";
import "./Card.css";
const Card = ({cardShow , data , removeProducts, buyFormShow}) => {
  const [total,setTotal]=useState(0);
  const [items,setItems]=useState(0);


  useEffect(()=>{
    let totalPrice = 0;
    let numItems = 0;
    data.forEach((p)=>{
      totalPrice+=p.price;
      numItems+=p.quantity;
    })
    setTotal(totalPrice);
    setItems(numItems);
  },[data])

  return (
    <div className="shopping-card">
      <div className="card-header">
        <button className="close-btn" onClick={cardShow}>
          <i class="fa-solid fa-xmark"></i>
        </button>
        <h1 className="title">Shopping card</h1>
        <p className="num-items">
          <span className="num">{items}</span> Item
        </p>
      </div>

      <div className="card-commande">
        {data.map((p) => (
            <div className="card-product" title={p.title}>
              <img src={p.image} alt={p.title} />
              <div className="product-details">
                <h3>{p.title}</h3>
                <p>{p.price}$</p>
                <span>Quantity: {p.quantity}</span>
              </div>
              <button className="remove-product" onClick={()=>removeProducts(p)}>Remove</button>
            </div>
        ))}
      </div>

      <div className="card-footer">
        <div className="total">
          <span>Total:</span>
          <span id="total-price">{total} $</span>
        </div>

        <button className="buy btn-p" onClick={buyFormShow}>Buy Now</button>
        <button className="skip btn-s" onClick={cardShow}>Keep Shopping</button>
      </div>
    </div>
  );
};

export default Card;

