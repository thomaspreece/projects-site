import React from 'react'
import { useParams, useNavigate, Outlet, useLocation } from "react-router";
import "./Navigation.css"

import { nameToSlug} from './helpers';

function Navigation({projectCategories}) {
    const navigate = useNavigate();
    let { categoryNameSlug } = useParams();
    let location = useLocation()

    let allProjectCategories = [
        "All",
        ...projectCategories
    ]

    let categoryIndex = 0;
    if(categoryNameSlug) {
        categoryNameSlug = nameToSlug(categoryNameSlug)
        categoryIndex = allProjectCategories.findIndex((i) => nameToSlug(i) === categoryNameSlug)
        if (categoryIndex < 0) {
            categoryIndex = 0
        }
    }


    let menuText = ""
    let menuUrl = "/"
    let categoryUrl = "/"
    let nextCategoryIndex = (categoryIndex + 1) % allProjectCategories.length 
    if(location.pathname.startsWith("/list")){
        // Currently on list route 
        menuText = "🂠"
        menuUrl = `/view/${categoryNameSlug}/`
        categoryUrl = `/list/${nameToSlug(allProjectCategories[nextCategoryIndex])}/`
    } else {
        // Currently on view route 
        menuText = "☰"
        menuUrl = `/list/${categoryNameSlug}/`
        categoryUrl = `/view/${nameToSlug(allProjectCategories[nextCategoryIndex])}/`
    }

    return <div>
    <button key="menu" id="menu-button" onClick={() => navigate(menuUrl)}>{menuText}</button>
    <button key="category" id="category-button" onClick={() => navigate(categoryUrl)}>
        <span>Category: {allProjectCategories[categoryIndex]}</span>
    </button>

    <Outlet />
</div>

}

export default Navigation;