import React, { useState, useEffect, useCallback } from 'react'
import './Deck.css'
import Card from './Card';

import { useParams, useNavigate } from "react-router";
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

const nameToSlug = (name) => {
  var returnValue = ""
  returnValue = name.replaceAll(" ", "_")
  returnValue = returnValue.toLowerCase()
  return returnValue
}

const getCardData = () => {
  return rawCardDataArray.map((i) => {
    const shallowCopy = Object.assign({}, i);
    if (!shallowCopy.image.startsWith("http")){
      if (shallowCopy.image.length > 0) {
        shallowCopy.image = process.env.PUBLIC_URL + "/project_images/" + shallowCopy.image 
      } else {
        shallowCopy.image = process.env.PUBLIC_URL + "/blank.jpg"
      }
    }
    shallowCopy.status = statues[shallowCopy.status]
    if(shallowCopy.category) {
      shallowCopy.category_slugs = shallowCopy.category.map((item) => nameToSlug(item))
    }
    return shallowCopy
  })
}

function Deck() {
  let cardDataArray = getCardData()

  let { categoryName, itemName } = useParams();
  let initialOffset = 0;

  if(categoryName) {
    categoryName = nameToSlug(categoryName)
    if (categoryName !== "all") {
      cardDataArray = cardDataArray.filter(
        (cardData) => cardData["category_slugs"] && cardData["category_slugs"].includes(categoryName)
      )
    }
  } else {
    categoryName = "all"
  }

  if(itemName) {
    itemName = nameToSlug(itemName)
    const foundIndex = cardDataArray.findIndex((cardData) => nameToSlug(cardData["name"]) === itemName)
    if(foundIndex > -1){
      initialOffset = foundIndex
    }
  }

  const navigate = useNavigate();

  const [offset, setOffset] = useState(initialOffset);

  const changeOffset = useCallback((diff) => {
    if(cardDataArray.length === 0) {
      return 
    }
    const newOffset = offset + diff
    const newItemName = nameToSlug(cardDataArray[newOffset % cardDataArray.length]["name"])
    setOffset(offset + diff)
    navigate(`/category/${categoryName}/item/${newItemName}`, {replace: true});
  }, [offset, categoryName, navigate, cardDataArray]);

  const handleKeyDown = useCallback((event) => {
    if(event.key === "ArrowRight"){
      changeOffset(+1)
    }
    if(event.key === "ArrowLeft") {
      changeOffset(-1)
    }
  }, [changeOffset]);
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  var deck_jsx = []

  if(cardDataArray.length > 0) {
    document.title = `${cardDataArray[initialOffset]["name"]} - ${categoryName ? categoryName : "all"} projects`
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
  }

  
  

  return <div>
    <button id="prev-button" onClick={() => changeOffset(-1)}>◄</button>
    <div id="cardroot" tabIndex={0}>
      {deck_jsx}
    </div>
    <button id="next-button" onClick={() => changeOffset(+1)}>►</button>
  </div>
}



export default Deck;
