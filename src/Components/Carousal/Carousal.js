import React from 'react'
import './Carousal.css'

function Carousal({items}) {


    const slides = items.map(item=>{
        return URL.createObjectURL(item);
    })
    
    

    return (
        <div className='carousal-container'>
           {slides.map((slide)=>(
               <CarousalItem src={slide}/>
           ))}
        </div>
    )
}

function CarousalItem({src}) {
    return(
        <div className='carousal-item-container'>
            <img className='img-box' src={src} alt='carousalitem'/>
        </div>
    )
}

export default Carousal
