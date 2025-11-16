import React, { useState, useEffect } from 'react'
import './App.css'
import Card from './Card';

import rawCardDataArray from './projects.json';

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
    shallowCopy.image = process.env.PUBLIC_URL + shallowCopy.image 
  }
  shallowCopy.status = statues[shallowCopy.status]
  return shallowCopy
})

function Deck() {

  const [offset, setOffset] = useState(0);

  const handleKeyDown = (event) => {
      if(event.key === "ArrowRight"){
        setOffset(offset + 1)
      }
      if(event.key === "ArrowLeft") {
        setOffset(offset - 1)
      }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);


  var deck_jsx = []
  Array.from({ length: maxRenderedCards }, (x, i) => {
    const cuttoff = Math.ceil(maxRenderedCards/2)

    // Card Index. Orders cards so front has 0,1,2,3... and back has -1,-2,-3,...
    // Numbers meet in middle of card stack at cuttoff
    var cardIndex = maxRenderedCards - i - 1
    if (cardIndex >= cuttoff) {
      cardIndex = - (maxRenderedCards-cardIndex)
    }

    // Card Position back=0, front=max
    var cardPosition = (i + offset) % maxRenderedCards
    if(cardPosition < 0) {
      cardPosition += maxRenderedCards
    }

    deck_jsx.push(<Card 
      key={i} 
      cardDataArray={cardDataArray}
      cardPosition={cardPosition} 
      cardIndex={cardIndex} 
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
