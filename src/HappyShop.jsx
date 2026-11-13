import React, { useState , useEffect  } from "react";
import Header from "./layouts/Header";
import Slider from "./components/Slider";
import Products from "./components/Products";
import Footer from "./layouts/Footer";
import Contact from "./components/Contact";
import Card from "./components/Card";
import {Routes, Route } from "react-router-dom";
import Search from "./components/Search";
import SearchRes from "./components/SearchRes";
import BuyForm from "./components/BuyForm";
import { ProductDataLocal } from "./assets/Data/ProductDataLocal";
import Loader from "./components/Loader";
import axios from "axios";
const HappyShop = () => {
  const [card, setCard] = useState(false);
  const [search,setSearch] = useState(false);
  const [buyForm,setBuyForm] = useState(false);
  const [searchRes , setSearchRes] = useState(false);
  const [productData, setProductData] = useState([]);
  const [productsCard,setProductsCard] = useState([]);
  const [searchCont , setSearchCont] = useState([]);

  function cardShow() {
    setCard(card ? false : true);
  }


  function SearchShow(){
    setSearch(search ? false : true);
    setSearchRes(search ? false : true)
  }

  function buyFormShow(){
    setBuyForm(buyForm ? false : true);
  }



  useEffect(() => {
    axios.get("http://localhost/happyChop/backend/api/products")
    .then(response => setProductData(response.data.data))
    .catch((error) => console.error(`Cannot get the data from server ! and the error is ${error}`))
    .finally(()=>console.warn("This ecom is just for learning!"));
  }, []);
  
  const categories = ["all",...new Set(productData.map((p) => p.category))];

function addProduct(p) {
  setProductsCard((productsCard) => {
    const exists = productsCard.find((pro) => pro.id === p.id);
    if (exists) {
      return productsCard.map((pro) =>
        pro.id === p.id
          ? {
              ...pro,
              quantity: pro.quantity + 1, 
              price: (pro.quantity + 1) * pro.price
            }
          : pro
      );
    } else {
      return [...productsCard, { ...p, quantity: 1}];
    }
  });
}

function RemoveProducts(product){
  setProductsCard(productsCard.filter(p => p.id != product.id))
}


function saveSearchCont(content) {
  setSearchCont([...searchCont,content]);
  setSearchRes(true);
}

useEffect(()=>{
  document.onscroll =()=>{
    if(window.scrollY > 100){
      setCard(false);
      setSearchRes(false);
      setSearch(false);
      setBuyForm(false);
      setSearchCont([]);
    }
  }
},[card,search,searchRes,buyForm])

  return (
    <>
      <Loader />
      {card ? <Card cardShow={cardShow} data={productsCard} removeProducts={RemoveProducts} buyFormShow={buyFormShow} /> : <></>}

      <Header action={cardShow} data={productsCard} action2={SearchShow}>
        {search ? <Search list={productData} savingCont={saveSearchCont}  /> : <></>}
        {searchRes ? <SearchRes content={searchCont} /> : <></>}
      </Header>

      <Slider />
      {(buyForm & productsCard.length > 0 ) ? <BuyForm data={productsCard} buyFormShow={buyFormShow} /> : <></>}
      <Routes>
        <Route path="/" element={<Products data={productData} categories={categories} action={addProduct}/>} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
};

export default HappyShop;
