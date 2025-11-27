import React from 'react'
import { Link } from 'react-router';
import { nameToSlug, statues } from './helpers';
import './List.css'
import { useNavigate } from "react-router";

function compareByKey(a, b, key) {
  if(a[key] < b[key]){
    return -1 
  } else if (a[key] > b[key]){
    return 1
  } else {
    return 0
  }
}

function List({projectsArray, projectCategories}) {
  const navigate = useNavigate();

  const projectCountByCategory = projectCategories.map((category) => ({
    name: category,
    projectNumber: 0
  }))

  projectsArray.forEach((project) => {
    if("category" in project){
      project["category"].forEach((category) => {
        projectCountByCategory[category] += 1
      })
    }
  })

  let projects_jsx = []
  Object.values(statues).forEach((status) => {
    
    
    let projects_for_status = projectsArray
      .filter((project) => {
        return project["status"] === status
      })
      .sort((a, b) => {
        if("createdDate" in a && "createdDate" in b){
          return -1*compareByKey(a, b, "createdDate")
        } else {
          return compareByKey(a, b, "name")
        }
        
      })

    let projects_for_status_jsx = projects_for_status
      .map(
        (project, i) => <li key={`project-${i}`}>
          <Link to={`/category/all/item/${nameToSlug(project.name)}`}>{project.name}</Link>
        </li>)
    
    if(projects_for_status.length > 0){
      projects_jsx.push(<h2>{status}</h2>)
      projects_jsx.push(<ul>
        {projects_for_status_jsx}
      </ul>)
    }
    
  })

  return <div id="listroot">
    <button id="back-button" onClick={() => navigate(-1)}>🂠</button>
    <img alt="" src={`${process.env.PUBLIC_URL}/images/canvas-top.png`}></img>
    <div style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/canvas-main.png)` }}>
      <h1>Projects</h1>
      {projects_jsx}
    </div>
  </div>
}



export default List;
