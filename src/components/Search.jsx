import React, { useRef, useState } from 'react'
import "./Search.css";
const Search = ({list,savingCont}) => {
  const input = useRef(null);

  function searchContent(){
    let value = input.current.value;
    list.forEach(elemnt => {
      if(elemnt.title.toLowerCase().includes(value.toLowerCase())){
        savingCont(elemnt);
      }
    });
  }

  return (
    <div className="search">
        <input type="search" list='searchList' ref={input} />
        <datalist id='searchList'>
            {
                list.map((elemnt)=>(
                    <option value={elemnt.title}></option>
                ))
            }
        </datalist>
        <button className='btn-p' onClick={searchContent}><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>
  )
}

export default Search;