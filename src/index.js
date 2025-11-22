import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Deck from './Deck';
import { BrowserRouter, Routes, Route  } from "react-router";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Deck />} />
        <Route path="category/:categoryName" element={<Deck />}>
          <Route path="item/:itemName" element={<Deck />} /> 
        </Route>
      </Routes>
    </BrowserRouter>    
  </React.StrictMode>
);

