import React from 'react'
import { Link } from 'react-router';
import { nameToSlug } from './helpers';

function List({projectsArray, projectCategories}) {
  console.log(projectsArray)
  console.log(projectCategories)

  let categories_jsx = projectCategories.map((category, i) => <li key={`category-${i}`}><Link to={`/category/${nameToSlug(category)}`}>{category}</Link></li>)
  let projects_jsx = projectsArray.map((project, i) => <li key={`project-${i}`}><Link to={`/category/all/item/${nameToSlug(project.name)}`}>{project.name}</Link></li>)

  return <div>
    <h1>Categories</h1>
    <ul>
      {categories_jsx}
    </ul>
    <h1>Projects</h1>
    <ul>
      {projects_jsx}
    </ul>
  </div>
}



export default List;
