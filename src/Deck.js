import React, { useState, useEffect, useCallback } from 'react'
import './Deck.css'
import Card from './Card';

import rawCardDataArray from './projects.json';

// Use even number otherwise it breaks
const maxRenderedCards = 8 

const statues = {
  "BACKLOG": "💡 Ideation",
  "STARTED": "⏳ In progress",
  "COMPLETE": "✅ Complete",
  "CANCELLED": "⚠️ Cancelled",
  "DECOMISSIONED": "🚫 Decomissioned",
}

const cardDataArray = rawCardDataArray.map((i) => {
  const shallowCopy = Object.assign({}, i);
  if (!shallowCopy.image.startsWith("http")){
    if (shallowCopy.image.length > 0) {
      shallowCopy.image = process.env.PUBLIC_URL + "/project_images/" + shallowCopy.image 
    } else {
      shallowCopy.image = process.env.PUBLIC_URL + "/blank.jpg"
    }
  }
  shallowCopy.status = statues[shallowCopy.status]
  return shallowCopy
})

function Deck() {

  const [offset, setOffset] = useState(2);

  const handleKeyDown = useCallback((event) => {
    if(event.key === "ArrowRight"){
      setOffset(offset + 1)
    }
    if(event.key === "ArrowLeft") {
      setOffset(offset - 1)
    }
  }, [offset]);
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);


  var deck_jsx = []
  Array.from({ length: maxRenderedCards }, (x, i) => {
    deck_jsx.push(<Card 
      key={i} 
      cardDataArray={cardDataArray}
      initialCardNumber={i}
      cardOffset={offset}
      maximumCards={maxRenderedCards} 
    />)

    return null
  });

  return <div>
    <button id="prev-button" onClick={() => setOffset(offset - 1)}>◄</button>
    <div id="cardroot" tabIndex={0}>
      {deck_jsx}
    </div>
    <button id="next-button" onClick={() => setOffset(offset + 1)}>►</button>
  </div>
}



export default Deck;
