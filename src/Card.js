import React, { useState, useRef } from 'react'
import { useSpring, animated, to } from 'react-spring'

// TODO: Fix issue where cards flip if you move more than one at a time 

const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`
const showDebug = false 


function Card({cardPosition, cardIndex, maximumCards, cardDataArray}) {
  const cardDataArrayMaximum = cardDataArray.length

  const cardRef = useRef(null);
  
  var width = 0
  var height = 0
  
  if(cardRef.current){
    const boundingRect = cardRef.current.getBoundingClientRect()
    width = boundingRect.width
    height = boundingRect.height
  }
  

  const maximumIndex = maximumCards - 1
  
  const zIndex = i => {
    return i % maximumCards  
  }

  const cuttoff = Math.floor(maximumCards/2)
  
  // These two are just helpers, they curate spring data, values that are later being interpolated into css
  const start_to = i => ({ x: 0, y: (i * 4 - height*0.1), scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 + 1000 })
  const start_from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000, zIndex: zIndex(i) })

  const [props, set] = useSpring(i => ({ ...start_to(cardPosition), from: start_from(cardPosition) })) 

  const [prevCardPosition, setPrevCardPosition] = useState(cardPosition);
  const [dataOffset, setdataOffset] = useState(0);


  if (cardPosition !== prevCardPosition) {
    
    if(prevCardPosition == maximumIndex && cardPosition == 0){
      // Card Moving to back of stack 
      set([{zIndex: 100, x: (width*1.2)}, {zIndex: -100}, start_to(cardPosition), {zIndex: zIndex(cardPosition)}])
    } else if (prevCardPosition == 0 && cardPosition == maximumIndex) {
      // Card Moving to front of stack
      set([{zIndex: -100, x: -(width*1.2)}, {zIndex: 100}, start_to(cardPosition), {zIndex: zIndex(cardPosition)}])
    } else {
      set({zIndex: zIndex(cardPosition), immediate: true})
    }
    setPrevCardPosition(cardPosition);

    if (prevCardPosition==cuttoff && cardPosition == cuttoff-1){
      setdataOffset(dataOffset - maximumCards)
    } else if (prevCardPosition==cuttoff-1 && cardPosition == cuttoff){
      setdataOffset(dataOffset + maximumCards)
    }
  }

  var dataIndex = (cardIndex + dataOffset) % cardDataArrayMaximum
  if(dataIndex < 0){
    dataIndex += cardDataArrayMaximum
  }

  const cardData = cardDataArray[dataIndex]
  var feature_list_jsx = <ul>
    {cardData.features.map((v) => {
      return <li>{v}</li>
    })}
  </ul>

  const debug_jsx = <div className="carddebug">
    Position: {cardPosition} <br/>
    Index: {cardIndex} <br />
    Data Index: {dataIndex} <br />
    Data Offset: {dataOffset} <br />
  </div>

  const card_jsx = <animated.div key={cardPosition} className="cardcontainer" style={{ transform: to([props.x, props.y], (x, y) => `translate3d(${x}px,${y}px,0)`) , zIndex: props.zIndex}} cardnumber={dataIndex}>
    <animated.div ref={cardRef} className="card" style={{ transform: to([props.rot, props.scale], trans), backgroundImage: `url(${process.env.PUBLIC_URL}/notebook.png)` }}>
      <div className="cardimage" >
        <div style={{backgroundImage: `url(${cardData.image})`}}></div>
      </div>
      <div className="cardstatus"> 
        <div>
          <h2 className="cardheadingh2" style={{"margin-top": "5%"}}>PROJECT STATUS</h2>
          <hr className="cardheadinghr"/>
          <h3>{cardData.status}</h3>              
        </div>
      </div>
      <div className="carddata">
        <h2 className="cardheadingh2">PROJECT NAME</h2>
        <hr className="cardheadinghr"/>
        <h1>{cardData.name}</h1>
        <h2 className="cardheadingh2">PROJECT DESCRIPTION</h2>
        <hr className="cardheadinghr"/>
        <p>{cardData.description}</p>
        <h2 className="cardheadingh2">PROJECT FEATURES</h2>
        <hr className="cardheadinghr"/>
        {feature_list_jsx}
      </div>
      {showDebug ? debug_jsx : null }
    </animated.div>
  </animated.div>
  return card_jsx
}

export default Card;
