import React, { useState } from 'react'
import './App.css'
import Card from './Card';

const maxRenderedCards = 8

const statues = {
  "BACKLOG": "💡 Ideation",
  "STARTED": "⏳ In progress",
  "COMPLETE": "✅ Complete",
  "CANCELLED": "⚠️ Cancelled",
  "DECOMISSIONED": "🚫 Decomissioned",
}

const cardDataArray = [  
  {
    image: `${process.env.PUBLIC_URL}/project_images/ACM.jpg`, 
    name: "Cheese-o-matic",
    description: "Make cheese at home for more time and money than going to the store!",
    status: statues["COMPLETE"],
    features: [
      "Custom circuitboard",
      "Arduino, RPi & OctoPrint",
      "Water heater & ingredient dispencers"
    ]
  },
  {
    image: `${process.env.PUBLIC_URL}/project_images/Cheddar.jpg`, 
    name: "Automatic Cat Feeder",
    description: "Sometimes it feeds your cat. Sometimes the cat is unhappy.",
    status: statues["CANCELLED"],
    features: [
      
    ]
  },
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg', name: "card-3"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg', name: "card-4"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg', name: "card-5"},  
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg', name: "card-6"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg', name: "card-7"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg', name: "card-8"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg', name: "card-9"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg', name: "card-10"} , 
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg', name: "card-11"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg', name: "card-12"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg', name: "card-13"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg', name: "card-14"},
  // {image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg', name: "card-15"}      
]

function Deck() {

  const [offset, setOffset] = useState(0);

  const handleKeyDown = (event) => {
      if(event.key == "ArrowRight"){
        setOffset(offset + 1)
      }
      if(event.key == "ArrowLeft") {
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
  });

  return <div id="cardroot" onKeyDown={handleKeyDown} tabIndex={0}>
    {deck_jsx}
  </div>
}



export default Deck;
