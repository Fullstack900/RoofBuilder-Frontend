
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment"

import {Card, CardBody } from 'reactstrap'
import {  getData } from '../store'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const CardList = () => {
  
  const dispatch = useDispatch()
  const store = useSelector(state => state.leads)
  const [sort, setSort] = useState('desc')
  //const [searchTerm, setSearchTerm] = useState('')
  const [currentPage/*, setCurrentPage*/] = useState(1)
  const [sortColumn/*, setSortColumn*/] = useState('updatedAt')
  const [rowsPerPage/*, setRowsPerPage*/] = useState(10)
 // const [sidebarOpen, setSidebarOpen] = useState(false)

    // ** Get data on mount
    useEffect(() => {
      // dispatch(getAllData())

      setSort('desc')
      //setCurrentPage(1)
      //setRowsPerPage(10)
      //setSortColumn('id')
       dispatch(
         getData({
           sortDirection:sort,
           sortField:sortColumn,
           limitCount:rowsPerPage,
           skipCount: ((currentPage - 1) * rowsPerPage)
         //  q: searchTerm,
         //  page: currentPage
           //perPage: rowsPerPage//,
       //    role: currentRole.value,
     //      status: currentStatus.value,
      //     currentPlan: currentPlan.value
         })
       )
     }, [dispatch, store.data.length, sort, sortColumn, currentPage])
  // ** Table data to render
  const dataToRender = () => {
    if (store.data.length > 0) {
    const filters = {
    //  role: currentRole.value,
     // currentPlan: currentPlan.value,
    //  status: currentStatus.value,
   //   q: searchTerm
    }
    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData
    }
    
  }
return []
} 
console.log(dataToRender())
return (dataToRender().map((project => {
  
  return (
  <Link style={{color: "black"}}
  to={`/apps/lead/view/${project._id}`}  >
    <Card>
    <CardBody>
      <div>
        <h2>{project.client_name}      
         
              </h2>
        
        <div>
        {project.job_name}
        <span style={{float:"right"}}>{moment(project.created_at).utc().format('YYYY-MM-DD')}</span>
        </div>
        <div>
        {project.salesperson}
        <span style={{float:"right"}}>
        {project.sale_state}
        </span>
        </div>
        <div style={{textAlign:"right"}}>
          <span>{project.type}</span><span> - </span>
          <span>{project.paidby}</span><span> </span>
          <span>$0.00</span>
        </div>
        <div> {project.address_line_1}</div>
        <div> {project.address_line_2}</div>
        <div> {project.city}, {project.state} {project.zip}</div>
      </div>
      </CardBody>
      </Card>
      </Link>
  )
})))
}

export default CardList
