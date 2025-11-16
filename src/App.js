import React, { useState } from 'react'
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
  if (!i.image.startsWith("http")){
    i.image = process.env.PUBLIC_URL + i.image 
  }
  i.status = statues[i.status]
  return i
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

  return <div id="cardroot" onKeyDown={handleKeyDown} tabIndex={0}>
    {deck_jsx}
  </div>
}



export default Deck;
