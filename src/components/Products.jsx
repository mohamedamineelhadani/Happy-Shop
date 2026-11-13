import React, { useState } from "react";
import "./Products.css";
import Product_card from "./Product_card";

const Products = ({data,categories,action}) => {
  const [category, setCategory] = useState("all");
  return (
    <section className="products-section">
      <h1 className="title">The Best Selling Products</h1>
      <div className="category">
        <select onChange={(e) => setCategory(e.target.value)}>
          {categories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select>

      </div>

      <div className="products">
        {data.map((product) => {
          if (category == "all") {
            return (
              <Product_card product={product} addProduct={action} />
            );
          }
          if (category == product.category) {
            return (
              <Product_card product={product} addProduct={action} />
            );
          }
        })}

      </div>

    </section>

  );


};



export default Products;
