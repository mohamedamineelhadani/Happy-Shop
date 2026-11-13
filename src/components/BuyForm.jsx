import React ,{useState,useEffect} from "react";
import "./BuyForm.css";
import axios from "axios";
const BuyForm = ({data,buyFormShow}) => {
  const [total,setTotal]=useState(0);
  const [items,setItems]=useState(0);
  const [custmer,setCustmer]= useState({
    fullName:"",
    email:"",
    phone:"",
    products : data
  })


  async function postData(data){
    try{
      const response = await axios.post("dkfhdkj",data);
      // handler response
    }catch(error){
      // handler error
    }
  }
  
  
  useEffect(()=>{
    let totalPrice = 0;
    let numItems = 0;
    data.forEach((p)=>{
      totalPrice+=p.price;
      numItems+=p.quantity;
    })
    setTotal(totalPrice);
    setItems(numItems);
    setCustmer({...custmer,products:data});
  },[data])

  
  
  return (
    <div className="buyForm">
        <form className="box">
            <h1>Buy Form</h1>
            <div className="info">
              <span>Total : {total} $</span>
              <span>Items : {items}</span>
            </div>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName"  onChange={(e)=>setCustmer({...custmer,fullName:e.target.value})}/>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" onChange={(e)=>setCustmer({...custmer,email:e.target.value})} />
            <label htmlFor="tel">Phone</label>
            <input type="tel" id="tel" onChange={(e)=>setCustmer({...custmer,phone:e.target.value})} />
            <input type="submit" className="btn-p" value="Buy Now" onClick={(e) =>{
              e.preventDefault();
              if(custmer.fullName != "" && custmer.email != "" && custmer.phone != ""){

                axios.post("http://localhost/happyChop/backend/api/products/add",custmer)
                .then(response => console.log(response) )  //try
                .catch(error => console.log(error.message)); //catch


              }else{
                alert("please all info is requered")
              }
            }} />
            <input type="button" className="btn-s" value="Keep Shopping" onClick={(e) =>{
              e.preventDefault();
              buyFormShow();
            }} />
    </form>
    </div>
  );
};

export default BuyForm;
