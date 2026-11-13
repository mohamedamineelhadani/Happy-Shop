import React, {  useEffect, useState } from "react";
import { Link,NavLink } from "react-router-dom";
import "./Header.css";


const Header = ({action,data,children,action2}) => {
  const [theme,setTheme] = useState(localStorage.getItem("theme") || "sun")
  const [count,setCount] =useState(0);
  useEffect(()=>{
    let counter = 0;
    data.forEach(p => {
      counter += p.quantity;
    });
    setCount(counter);
  },[data])

  function scroll(){
    window.scrollTo({ top: 600,behavior: "smooth"})
  }

  function themeSwitch(){
    if(document.body.className=="dark"){
      document.body.classList.remove("dark");
      localStorage.setItem("theme","sun");
      setTheme("sun");
    }else{
      document.body.classList.add("dark");
      localStorage.setItem("theme","moon");
      setTheme("moon")
    }
  }

  useEffect(()=>{
    if(localStorage.getItem("theme") == "moon"){
      document.body.classList.add("dark");
    }else{
      document.body.classList.remove("dark");
    }
  },[])

  return (
      <header>
        <div className="txt-marquee">
          <marquee behavior="scroll" direction="left" scrollamount="10" scrolldelay="60" loop="-1"> Quality guaranteed ✅ Cash on delivery 💰 Prices include delivery 🚚 </marquee>
        </div>
        <nav>
          <div className="logo">
            <Link to="/">HappyShop</Link>
          </div>
          <ul className="links">
            <li><NavLink to="/" className={({ isActive }) => (isActive && "active")} onClick={scroll}>Home</NavLink></li>
            <li><NavLink to="/contact"  className={({ isActive }) => (isActive && "active")} onClick={scroll}>Contact Us</NavLink></li>
          </ul>

          <div className="btns">
            <button className="card-btn btn-p" title="Card" onClick={action}><i class="fa-solid fa-money-check-dollar"></i><span className="notification">{count}</span></button>
            <button className="search-btn btn-p" title="Search" onClick={action2}><i class="fa-solid fa-magnifying-glass"></i></button>
            <button className="mode-btn btn-p" title={`${(theme == "sun" ?"light" :"night")} mode`} onClick={themeSwitch}><i class={`fa-solid fa-${theme}`}></i></button>
          </div>
        </nav>
        <div className="commponents">
          {children}
        </div>
      </header>
  );
};
export default Header;
