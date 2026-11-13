import React from 'react'
import "./SearchRes.css";
const SearchRes = ({content}) => {
  return (
    <div className='searchRes'>
        {content.map((element)=>(
            <div className='searchResBox box' onClick={()=>document.getElementById(element.id).scrollIntoView({ behavior: "smooth" })}>
                <div className="image">
                    <img src={element.image} alt={element.title} />
                </div>
                <h1 className="title">{element.title}</h1>
                <p className="price">{element.price}$</p>
            </div>
        ))}
    </div>
  )
}

export default SearchRes;