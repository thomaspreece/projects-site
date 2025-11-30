import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Deck from './Deck';
import List from './List'
import Navigation from './Navigation';
import { BrowserRouter, Routes, Route, Navigate  } from "react-router";

import { statues } from './helpers';
import rawProjectArray from './projects.json';

const getProjectsArray = () => {
  return rawProjectArray.map((i) => {
    const shallowCopy = Object.assign({}, i);
    if (!shallowCopy.image.startsWith("http")){
      if (shallowCopy.image.length > 0) {
        shallowCopy.image = process.env.PUBLIC_URL + "/project_images/" + shallowCopy.image 
      } else {
        shallowCopy.image = process.env.PUBLIC_URL + "/images/blank.jpg"
      }
    }
    shallowCopy.status = statues[shallowCopy.status]
    return shallowCopy
  })
}

const getProjectCategories = () => {
  const categoriesUnduplicated = rawProjectArray.filter((i) => i.category).map((i) => i.category).flat()
  const categories = [...new Set(categoriesUnduplicated)]
  return categories
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const projectsArray = getProjectsArray()
const projectCategories = getProjectCategories()
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Navigation projectCategories={projectCategories} />}>
          <Route path="/" element={<Navigate to='/list/all' replace />} />
          <Route path="/list/:categoryNameSlug" element={<List projectsArray={projectsArray} projectCategories={projectCategories}/>} />
          <Route path="/view/:categoryNameSlug" element={<Deck projectsArray={projectsArray} projectCategories={projectCategories}/>}>
            <Route path="item/:itemNameSlug" element={<Deck projectsArray={projectsArray} projectCategories={projectCategories}/>} /> 
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>    
  </React.StrictMode>
);

