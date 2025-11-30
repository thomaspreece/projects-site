import React from 'react'
import { Link, useParams } from 'react-router';
import { nameToSlug, statues } from './helpers';
import './List.css'

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

  let { categoryNameSlug } = useParams();
  let categoryName = "All";

  let filteredProjectsArray = projectsArray

  if(categoryNameSlug) {
    categoryNameSlug = nameToSlug(categoryNameSlug)
    categoryName = projectCategories.find((i) => nameToSlug(i) === categoryNameSlug)
    if (categoryName) {
      filteredProjectsArray = projectsArray.filter(
        (projectData) => projectData["category"] && projectData["category"].includes(categoryName)
      )
    } else {
      categoryName = "All"
    } 
  } 



  let projects_jsx = []
  Object.values(statues).forEach((status) => {
    
    let projects_for_status = filteredProjectsArray
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
          <Link to={`/view/${categoryNameSlug}/item/${nameToSlug(project.name)}`}>{project.name} ({project.createdDate.split("-")[0]})</Link>
        </li>)
    
    if(projects_for_status.length > 0){
      projects_jsx.push(<h2 key={`${status}-h2`}>{status.toUpperCase()}</h2>)
      projects_jsx.push(<hr />)
      projects_jsx.push(<ul key={`${status}-ul`}>
        {projects_for_status_jsx}
      </ul>)
    }
    
  })

  return <div id="listroot">
    {/* <img alt="" src={`${process.env.PUBLIC_URL}/images/canvas-top.png`}></img> */}
    <div style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/canvas.png)` }}>
      <h1>Projects ({categoryName})</h1>
      {projects_jsx}
    </div>
  </div>
}



export default List;
