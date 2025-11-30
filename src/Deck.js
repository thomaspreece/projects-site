import React, { useState, useEffect, useCallback } from 'react'
import './Deck.css'
import Card from './Card';

import { useParams, useNavigate } from "react-router";
import { nameToSlug} from './helpers';

// Use even number otherwise it breaks
const maxRenderedCards = 8 

function Deck({projectsArray, projectCategories}) {
  let filteredProjectsArray = projectsArray;

  let { categoryNameSlug, itemNameSlug } = useParams();
  let initialOffset = 0;
  let categoryName = "all";

  if(categoryNameSlug) {
    categoryNameSlug = nameToSlug(categoryNameSlug)
    categoryName = projectCategories.find((i) => nameToSlug(i) === categoryNameSlug)
    if (categoryName) {
      filteredProjectsArray = projectsArray.filter(
        (projectData) => projectData["category"] && projectData["category"].includes(categoryName)
      )
    } else {
      categoryName = "all"
      categoryNameSlug = "all"
    }
  } else {
    categoryNameSlug = "all"
  }

  if(itemNameSlug) {
    itemNameSlug = nameToSlug(itemNameSlug)
    const foundIndex = filteredProjectsArray.findIndex((projectData) => nameToSlug(projectData["name"]) === itemNameSlug)
    if(foundIndex > -1){
      initialOffset = foundIndex
    }
  }

  const navigate = useNavigate();

  const [offset, setOffset] = useState(initialOffset);

  const changeOffset = useCallback((diff) => {
    if(filteredProjectsArray.length === 0) {
      return 
    }
    let newOffset = offset + diff
    let arrayIndex = newOffset % filteredProjectsArray.length
    if (arrayIndex < 0){
      arrayIndex += filteredProjectsArray.length
    }
    const newItemName = nameToSlug(filteredProjectsArray[arrayIndex]["name"])
    setOffset(newOffset)
    navigate(`/view/${categoryNameSlug}/item/${newItemName}`, {replace: true});
  }, [offset, categoryNameSlug, navigate, filteredProjectsArray]);

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

  if(filteredProjectsArray.length > 0) {
    document.title = `${filteredProjectsArray[initialOffset]["name"]} - ${categoryNameSlug ? categoryNameSlug : "all"} projects`
    Array.from({ length: maxRenderedCards }, (x, i) => {
      deck_jsx.push(<Card 
        key={i} 
        cardDataArray={filteredProjectsArray}
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
