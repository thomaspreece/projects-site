import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSpring, animated, to } from 'react-spring'
import "./Card.css"

const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`
const showDebug = false 


function Card({
  initialCardNumber,
  cardOffset,
  maximumCards, 
  cardDataArray
}) {
  const cardIndexCuttoff = Math.ceil(maximumCards/2)

  // Card Index. Orders cards so front has 0,1,2,3... and back has -1,-2,-3,...
  // Numbers meet in middle of card stack at cuttoff
  var cardIndex = (maximumCards -1) - initialCardNumber
  if (cardIndex >= cardIndexCuttoff) {
    cardIndex = cardIndex - maximumCards
  }

  // Card Position back=0, front=max
  var fullCardPosition = (initialCardNumber + cardOffset)
  var cardPosition = fullCardPosition % maximumCards
  if(cardPosition < 0) {
    cardPosition += maximumCards
  }

  const cardDataArrayMaximum = cardDataArray.length

  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const imgDivRef = useRef(null);
  
  var width = 0
  var height = 0
  
  if(cardRef.current){
    const boundingRect = cardRef.current.getBoundingClientRect()
    width = boundingRect.width
    height = boundingRect.height
  }
  
  const [tapeOffset, setTapeOffset] = useState({
    tapeWidth: 0,
    tapeHeight: 0,
    tapeTop: 0,
    tapeLeft: 0    
  });

  const maximumIndex = maximumCards - 1
  
  const zIndex = i => {
    return i % maximumCards  
  }

  // These two are just helpers, they curate spring data, values that are later being interpolated into css
  const start_to = i => ({ x: 0, y: (i * 4 - height*0.1), scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 + 1000 })
  const start_from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000, zIndex: zIndex(i) })

  const [props, set] = useSpring(i => ({ ...start_to(cardPosition), from: start_from(cardPosition) })) 

  const [prevCardPosition, setPrevCardPosition] = useState(cardPosition);

  // Move cards when cardPosition changes
  if (cardPosition !== prevCardPosition) {
    if(prevCardPosition === maximumIndex && cardPosition === 0){
      // Card Moving to back of stack 
      set([{zIndex: 100, x: (width*1.2)}, {zIndex: -100}, start_to(cardPosition), {zIndex: zIndex(cardPosition)}])
    } else if (prevCardPosition === 0 && cardPosition === maximumIndex) {
      // Card Moving to front of stack
      set([{zIndex: -100, x: -(width*1.2)}, {zIndex: 100}, start_to(cardPosition), {zIndex: zIndex(cardPosition)}])
    } else {
      // Shifting Z position of other cards
      set({zIndex: zIndex(cardPosition), immediate: true})
    }
    setPrevCardPosition(cardPosition);
  }

  // We want cards to update whilst hidden in middle of stack
  // This function somehow magics that into happening. 
  // Trial and error to get it working. Wouldn't advice changing.
  var dataOffset = (Math.floor((fullCardPosition + cardIndexCuttoff)/maximumCards) - Math.ceil((cardIndex+1)/maximumCards))*8
  
  // Function to move the sticky tape on the images to correct place
  const handleResize = useCallback(() => {
    const top = (imgDivRef.current.offsetHeight - imgRef.current.offsetHeight)/2
    const left = (imgDivRef.current.offsetWidth - imgRef.current.offsetWidth)/2
    if (
      tapeOffset.tapeWidth !== imgRef.current.offsetWidth ||
      tapeOffset.tapeHeight !== imgRef.current.offsetHeight ||
      tapeOffset.tapeTop !== top ||
      tapeOffset.tapeLeft !== left
    ) {
      setTapeOffset({
        tapeWidth: imgRef.current.offsetWidth,
        tapeHeight: imgRef.current.offsetHeight,
        tapeTop: top,
        tapeLeft: left    
      })
    }
  }, [tapeOffset, imgRef, imgDivRef]);
  
  // Refresh tape location when viewport is resized
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Refresh tape location when image changes
  if(imgRef.current && imgDivRef.current){
    handleResize()     
  }

  // Refresh tape location after image has had chance to load 
  useEffect(() => {
    setTimeout(() => {
      handleResize()
    }, 1000)
  }, [handleResize]);  

  // Calculate the data item currently shown by card
  var dataIndex = (cardIndex + dataOffset) % cardDataArrayMaximum
  if(dataIndex < 0){
    dataIndex += cardDataArrayMaximum
  }

  const cardData = cardDataArray[dataIndex]
  
  // Generate JSX
  var feature_list_jsx = <ul>
    {cardData.features.map((v, i) => {
      if (typeof v == "string"){
        return <li key={i} >{v}</li>
      }
      if (v.text && v.link){
        return <li key={i}><a href={v.link} rel="noreferrer" target="_blank">{v.text}</a></li>
      }
      return v.text
    })}
  </ul>

  const debug_jsx = <div className="debug">
    cardPosition: {cardPosition} <br/>
    initialCardNumber: {initialCardNumber} <br/>
    cardIndex: {cardIndex} <br />
    dataIndex: {dataIndex} <br />
    dataOffset: {dataOffset} <br />
    cardOffset: {cardOffset} <br />
  </div>

  const card_jsx = <animated.div key={cardPosition} className="cardcontainer" style={{ transform: to([props.x, props.y], (x, y) => `translate3d(${x}px,${y}px,0)`) , zIndex: props.zIndex}} cardnumber={dataIndex}>
    <animated.div ref={cardRef} className="card" style={{ transform: to([props.rot, props.scale], trans), backgroundImage: `url(${process.env.PUBLIC_URL}/notebook.png)` }}>
      <div className="imagetape">
        <div style={{width: tapeOffset.tapeWidth, height: tapeOffset.tapeHeight, position: "relative", zIndex: 1, top: tapeOffset.tapeTop, left: tapeOffset.tapeLeft}}>
          {cardData.image.length > 0 ? <div className="tape-section"></div> : null}
        </div>
      </div>
      <div className="image" >
        <div ref={imgDivRef}>
          {cardData.image.length > 0 ? <img ref={imgRef} alt={cardData.name} src={cardData.image} /> : null}
        </div>
      </div>
      <div className="status"> 
        <div>
          <div>
          <h2 style={{"marginTop": "5%"}}>PROJECT STATUS</h2>
          <hr />
          <p>{cardData.status}{cardData.status_text && cardData.status_text.length > 0 ? ` - ${cardData.status_text}` : null}</p>              
          </div>
        </div>
      </div>
      <div className="data">
        <h2>PROJECT NAME</h2>
        <hr />
        <h1>{cardData.name}</h1>
        <h2>PROJECT DESCRIPTION</h2>
        <hr />
        <p>{cardData.description}</p>
        <h2>PROJECT FEATURES</h2>
        <hr/>
        {feature_list_jsx}
      </div>
      {showDebug ? debug_jsx : null }
    </animated.div>
  </animated.div>
  return card_jsx
}

export default Card;
