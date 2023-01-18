import { Fragment, useState, useEffect, Component } from 'react'
import {  useForm } from 'react-hook-form'
// ** Reactstrap Imports
import { Form, Button, Card, CardBody } from 'reactstrap'

import { saveMaterials, deleteMaterials} from '../store'
import { useDispatch } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faCircleXmark, faFileLines} from '@fortawesome/free-solid-svg-icons'

//const TI = require('../template_items.json')
/*
const MaterialSchema = yup.object({
  quantityvalidators: [yup.string().required().max(255)]//array of validators
})
*/

const MaterialsCard = ({ templates, TI, measurement, materialsList  }) => {
  console.log(measurement)
    const dispatch = useDispatch()
    const [myArray, setMyArray] = useState([])

    const  [materialHide, setMaterialHide] = useState(true)

    const {
      //control,
      register, 
     // watch,
      //setValue,
      //setError,
      handleSubmit,
      formState: {  }
    } = useForm({  })

    const defaultWaste = (p) => {
      switch (p.Category) {
        case 'Shingles':
          return 10
        case 'W-Valley':
          case 'Ice and Water':
          return 5
          case 'Other':
            return 10
      }
      return 0
      }

      const calc_qty = (p) => {
        let quantity = 0
         switch (p.Category) {
          case 'Shingles':
            quantity = (measurement.pitch_3 / 33) //bundle uom        
            break
            case 'Underlayment':
              return (measurement.area / 400) 
            case 'Hip and Ridge':
            quantity = (measurement.hip + measurement.ridge) / 30 
            break         
            case 'Starter':
            return (measurement.hip + measurement.ridge) / 100 
            case 'Drip Edge':
              return measurement.rake > 0 ? Math.round((measurement.rake + 5) / 10) : 0
            case 'Gutter Apron':
              return measurement.eave > 0 ? Math.round((measurement.eave + 5) / 10) : 0
            case 'W-Valley':
              return (measurement.valley) / 10
            case 'Ice and Water':
              return (measurement.eave) / 66
            case 'Other':
              if (p.ItemCode.search("SA CAP 1 SQ") > 0) {
                return measurement.low_pitch / 100 
              }     
              if (p.ItemCode.search("PLYBASE 2 SQ") > 0) {
                return measurement.low_pitch / 200 
              }            
              return measurement.area / 200
            case 'Coil Nails':
              return measurement.area / 1800
            case 'Plastic Caps':
              return measurement.area / 2500
            case 'Pipe Flashing ':
              break
            case 'Vents':
              if (p.ItemCode.search("VENT W/NAILS 12") > 0) {
                return Math.floor(measurement.ridge / 4) 
              }  
              if (p.ItemCode.search('TOP SHIELD ALUMINUM 750 VENT 8') > -1) {
                return measurement.boxvent
              }
              return 0
            case 'Other Fasteners':
              const ridge = myArray.find(item => {
                if (item.ItemCode.search('SHIELD ALUMINUM 750 VENT')) {   
                  return true
                }
                return false
              })
                console.log(ridge)
            case 'Caulk':
              return 1
              case 'Pipe Flashing':
                if (p.ItemCode.search('PIPE FLASHING 1"') > -1) { 
                  console.log(p.ItemCode)
                  console.log(measurement.pipeboot3)
                return measurement.pipeboot3
                } else
                if (p.ItemCode.search('PIPE FLASHING 3"') > -1) { 
                  console.log(p.ItemCode)
                  console.log(measurement.pipeboot4)
                  return measurement.pipeboot4
                  }
                return 0
            case 'Other Flashing Metal':   
            case 'Decking':           
              //return (measurement.ridge > 0 ? 1 : 0)
         }
      
         return quantity
    
        }
    const formulaDisplay = (p) => {
      const quantity = calc_qty(p).toFixed(2)
      switch (p.Category) {
        case 'Shingles':
          return `IF ≥ 3/12 Area(${measurement.pitch_3}) / 33 = ${quantity}`
        case 'Underlayment':
          if (p.ItemCode.search("15# 4 SQ") > 0) {
            return `Area(${measurement.area}) / 400 = ${quantity}`
          }
          return `Area(${measurement.area}) / 1000 = ${quantity}`
        case 'Hip and Ridge':
          return `Hip + Ridge(${measurement.hip} + ${measurement.ridge}) / 30 = ${quantity}`
        case 'Starter':
          return `Hip + Ridge(${measurement.hip} + ${measurement.ridge}) / 100 = ${quantity}`
        case 'Drip Edge':
          return `Rakes(${measurement.rake} + 5) / 10 rounded = ${quantity}`
        case 'Gutter Apron':
          return `Eaves(${measurement.eave} + 5) / 10 rounded = ${quantity}`
        case 'W-Valley':
          return `Valleys(${measurement.valley}) / 10 = ${quantity}`
        case 'Ice and Water':
          return `Eaves(${measurement.eave}) / 66 = ${quantity}`  
        case 'Other':
          if (p.ItemCode.search("SA CAP 1 SQ") > 0) {
            return `IF < 3/12 Area (${measurement.low_pitch}}) / 100 = ${quantity}` 
          }     
          return `IF < 3/12 Area (${measurement.low_pitch}}) / 200 = ${quantity}` 
        case 'Coil Nails':
          return `Area(${measurement.area}) / 1800 = ${quantity}` 
        case 'Plastic Caps':
          return `Area(${measurement.area}) / 2500 = ${quantity}` 
        case 'Pipe Flashing':
          case 'Pipe Flashing':
                if (p.ItemCode.search('PIPE FLASHING 1"') > -1) {  
                return `3" Pipe Boots(${measurement.pipeboot3})` 
                } else
                if (p.ItemCode.search('PIPE FLASHING 3"') > -1) { 
                  return `4" Pipe Boots(${measurement.pipeboot3})` 
                  }
                return 0
        case 'Vents':
          if (p.ItemCode.search("VENT W/NAILS 12") > 0) {
            return `Ridge(${measurement.ridge}) / 4 rounded = ${quantity}`
          }
          if (p.ItemCode.search('TOP SHIELD ALUMINUM 750 VENT 8') > -1) {
            return `${quantity}`
          }
          return `per unit` 
        case 'Other Fasteners':
          return '1 box per house IF a ridge vent'
        case 'Caulk':
          return "1 tube + 2 if chimines "
        case 'Other Flashing Metal':
          return "1 bundle of step flashing covers: 2 large or 3 medium or 4 small chimneys"
        case 'Siding':
          return "1 roll: 3 large or 4 medium or 5 small brick chimneys"
        case 'Spray Paint':
          return "1 can per house if a chimney"
        case 'Decking':
          return `Area(${measurement.area}) / 32 sq ft sheet`
      }
    }

    const getPrice = (itemcode) => {
      //find the item in the other list
     // //console.log(templates[2].items)
     // //console.log(itemcode)
    console.log(itemcode)
      const found = templates[2].items.find(element => {
        ////console.log(element)
        return element.itemCode === itemcode 
      })
      console.log(templates[2].items)
      console.log(found)
      if (found) {
        return found.price 
      }
      return 0 //found.price || 0
    }

    const loadList = (list) => {
      
      let i = 0
      setMyArray([])
      list.forEach((ml) => {
        console.log(ml)
        const newItem = TI.find((ti) => {
        //  //console.log(ti.ItemCode, ml.itemcode)
          return (ti.ItemCode === ml.itemcode)
        })
       console.log(newItem)
       if (newItem) { //if item from database is found in the template
        
        newItem.itemcode = newItem.ItemCode
        
       newItem.price = getPrice(newItem.ItemCode)
       newItem.lineNumber = i
       newItem.id = ml.id
       delete newItem.Quantity //left over json property capitalization
       newItem.waste = ml.waste
       const qty = calc_qty(newItem) //recalc based on measurements
       newItem.originalQuantity =  Math.ceil(qty + (qty * parseInt(newItem.waste) / 100)) 
       newItem.quantity = parseInt(ml.quantity)  
       newItem.lineTotal = newItem.quantity * newItem.price
       delete newItem.Color //left over json property
       newItem.color = ml.color
       newItem.formula = formulaDisplay(newItem)
       //console.log(newItem)
       setMyArray(arr => [...arr, newItem])
       ////console.log(newItem)
        i++

       }
      })
    }
    

  // ** Get lead on mount
  useEffect(() => {
    console.log(measurement, '- Has changed')
    if (materialsList) { //if passed a list from the databse use it
      loadList(materialsList)
      
    }
  }, [measurement])
    const generate = () => {
       let i = 0
       const newList = []
      TI.forEach(element => { // loop through each template item and add it to our list
        delete element.Quantity
        element.itemcode = element.ItemCode
        element.color = element.Color
        element.waste = defaultWaste(element)
        const qty = calc_qty(element) //recalc based on measurements
        element.originalQuantity =  Math.ceil(qty + (qty * parseInt(element.waste) / 100)) 
        element.quantity = element.originalQuantity
        if (element.itemcode.search("SG 30 SYNTHETIC") > 0) {
          element.quantity = 0
        }
        element.price = getPrice(element.ItemCode)
        element.lineTotal = element.quantity * element.price
        element.lineNumber = i
        element.formula = formulaDisplay(element)
        //setMyArray(arr => [...arr, element])
        newList.push(element)
        i++
      })
      console.log(newList)
      dispatch(
        saveMaterials({
          project: measurement.job_id,
          materialList: newList          
        })
      ).then((e) => {
        
       console.log(e)
        loadList(e.payload.data.data)
        
      })
    }
    const [loading, setLoading] = useState(false)
    const onSubmit = data => {  
     console.log(data)

    setLoading(true)
      dispatch(
        saveMaterials({
          project: measurement.job_id,
          materialList: myArray         
        })
      ).then((e) => {
        console.log(e.payload.data.data)
        //setMyArray([])
        //loadList(e.payload.data.data)

        setLoading(false)
        setMaterialHide(true)
      })    
    }
    const deleteItem = (matitem) => {
      //console.log(matitem)
      dispatch(
           deleteMaterials({
             id : matitem.id        
           })
        )
      const newarr = myArray.filter((item) => {
       if (item.ItemCode === matitem.ItemCode) return false

        console.log(item.itemCode !== itemCode)
        return true//item.name !== itemCode
      })
      setMyArray(newarr)
    }
    const updateItem = (product, qty, waste) => {
      console.log(product, waste)
        const newItems = myArray.map(item => {
          if (product.ItemCode === item.ItemCode) {   
            //console.log("d")         
            if (waste !== null) {
              console.log("w")   
              item.waste = parseInt(waste)
              qty = calc_qty(product) //recalc based on measurements
             
              item.originalQuantity =  Math.ceil(qty + (qty * parseInt(waste) / 100)) 
              qty = item.originalQuantity
              console.log(qty)
            }
            item.lineTotal = qty * item.price
            item.quantity = qty.toString()
            //console.log(qty)
            return item
          }
          
          return item
        })
        setMyArray([])
        
        console.log(newItems)
        setMyArray(newItems)
      }
    const  materialTotal = () => {
      let total = 0
      myArray.forEach(element => {
        total = total + (element.price * element.quantity)
      })
      return (total).toLocaleString("en-US")
    }
    const setColor = (color, item) => {
      item.AvailableColors.forEach((c) => {
        if (c === color) {
          console.log(c)
          item.color = color
        }
      }) 
    }
const defaultColor = (color) => {
  const newItems = myArray.map(item => {

    switch (item.Category) {
      case 'Shingles':
        return item
      case 'Hip and Ridge': //use same color
      console.log('hip ridge')
        item.color = color
        return item
    }
    if (item.itemcode.search('FLINTLASTIC SA CAP 1 SQ/RL') > 0) {      
      switch (color) { //map color direct for flintlastic colors
        case 'Aged Redwood':
          item.color = "Heather Blend"
          break
          case 'Beachwood':
          case 'Earthtone Cedar':
          item.color = "Resawn Shake"
          break
          case 'Charcoal Gray':
          case 'Dual Black':
          item.color = "Moire Black"
          break
          case 'Driftwood':
          item.color = "Weathered Wood"
          break
          case 'Dual Brown':
          item.color = "Burnt Sienna"
          break
          case 'Dual Gray':
          case 'Harvard Slate':
          item.color = "Colonial Slate"
          break
        case 'Weatherwood':
          item.color = "Redwood"
          break
      }
      return item
    }
    switch (color) {
      case 'Aged Redwood':
      case 'Beachwood':
      case 'Dual Brown':
      case 'Earthtone Cedar':
          setColor("Brown", item)
      break
      case 'Charcoal Gray':
      case 'Dual Black': 
      setColor('Charcoal', item)//set the color if available
      setColor('Black', item)//set the color if available
      break

      case 'Weatherwood':
      setColor('Bronze', item)
      case 'Driftwood':
      setColor('Weather Wood', item)
      setColor('Terra Bronze', item)
      break
      case 'Harvard Slate':
        setColor('Slate', item)
        setColor('Black', item)
      case 'Dual Gray':
        setColor('Gray', item)
      break
    }    
    return item
  })
  setMyArray(newItems)

}
    const colorSelect = (lineItem) => {
      
      if (lineItem.AvailableColors.length === 0) return ""
      return (<span>Color: <select value={lineItem.color} {...register(`product.${lineItem.lineNumber}.color`) }
      onChange={(e) => {

        const v = e.target.value
        console.log(v)
        if (lineItem.ItemCode.search("IKO CAMBRIDGE 3 BD/SQ") >= 0) {
          
          defaultColor(v)
        } 
          const newItems = myArray.map(item => {
            if (lineItem.ItemCode === item.ItemCode) {
              item.color = v        
              return item
            }
            
            return item
          })
          setMyArray(newItems)
        

    }}  
      > { lineItem.AvailableColors.map(c => {
        return (<option >{c}</option>)
      })} </select></span>)

    }
 //   const handleBlur = (e) => {
   //   alert("hello", e)
   // }
  const handleFocus = (product) => {
    console.log(product)
    const newItems = myArray.map(item => {
      if (product.ItemCode === item.ItemCode) {
        item.showInfo = true        
        return item
      }
      item.showInfo = false   
      return item
    })
    setMyArray(newItems)
  }
  const closeinfo = (product) => {   
    console.log(product) 
     const newItems = myArray.map(item => {
      if (product.ItemCode === item.ItemCode) {
        item.showInfo = false        
        return item
      }
      
      return item
    })
    setMyArray(newItems)
  }
const bigList = () => {

  const newList = []
 
  newList.map((item) => {
    item.AvailableColors = Object.assign([], item.AvailableColors)
  })
    return myArray

}
 const quantity_alert = (lineItem) => {
  if (lineItem.ItemCode.search("SG 30 SYNTHETIC") > 0) {
return (
  <div style={{display: parseInt(lineItem.quantity) > 0 ? "inline" : "none",
  backgroundColor: "orange", 
  position: "absolute", 
  marginLeft: "-100px", 
  color:"black",
  marginTop: "23px"}}>* Upgraded underlayment {lineItem.quantity === lineItem.originalQuantity ? "" : `Calculated quantity: ${lineItem.originalQuantity}`}</div>
)
  }
return (
  <div style={{display: parseInt(lineItem.quantity) !== lineItem.originalQuantity ? "inline" : "none",
  backgroundColor: "orange", 
  position: "absolute", 
  marginLeft: "-100px", 
  color:"black",
  marginTop: "23px"}}>* Calculated quantity: {lineItem.originalQuantity}</div>
)
 }

return (
  <Fragment>
      <Card>
        <CardBody >
          <div onClick={() => { setMaterialHide(!materialHide) }}>
          <h2 ><FontAwesomeIcon icon={faFileLines} /> Materials </h2>
        <div className='material-hide' >
        <span> ${materialTotal()}</span> &nbsp;&nbsp;&nbsp;&nbsp;
        <span style={{display:(materialHide ? "none" : "inline")}} >
        <FontAwesomeIcon icon={faChevronUp}   /></span>
        <span style={{display:(materialHide ? "inline" : "none")}} >
        <FontAwesomeIcon icon={faChevronDown} /></span>
        </div>
          </div>
       
        <div style={{display: materialHide ? "none" : "block"}}> 
               Template:
               <select disabled = {true}>
                 <option>{ templates[2].name } </option>                    
               </select>   
               <Button style={{display: myArray.length > 0 ? "none" : ""}} color='primary' onClick={() => generate()}>        
             Generate List            
            </Button>
            &nbsp;
            <img width="80px" src={templates[2].image}/>
            <Form onSubmit={handleSubmit(onSubmit)}  >
            <div style={{borderTop: "dashed 1px black", paddingTop: "10px", marginTop:"10px"}}>
            { bigList().map(lineItem  => { // convert list of matierals to display items

            return (<div style={{borderBottom: "dashed 1px black", marginBottom: "20px"}} >
              {lineItem.Category} - <b>{lineItem.ItemCode}</b><br/>
            { colorSelect(lineItem)}
          <span style={{display: "none", float:"right", color:"red", fontWeight:"bold"}} onClick={() => deleteItem(lineItem)}>  <FontAwesomeIcon icon={faCircleXmark}   /></span><br/>
          <input type="hidden" value={lineItem.id} {...register(`product.${lineItem.lineNumber}.id`)} />
          <input type="hidden" value={lineItem.ItemCode} {...register(`product.${lineItem.lineNumber}.itemcode`)} />
          Quantity: 
            <input autoComplete="off" 
            {...register(`product.${lineItem.lineNumber}.quantity`)}
            value={lineItem.quantity}
             
            style={{ textDecoration:"bold", border: parseInt(lineItem.quantity) !== lineItem.originalQuantity ? "solid orange 1px" : "", width:"40px"}}
            
            onFocus = {(e) => handleFocus(lineItem, e)}
          
            
            onChange={({ target: { value } }) => {
                //onChange(value)
                
                updateItem(lineItem, value, null)
                //lineItem.quantity = value
                //lineItem.lineTotal = value * lineItem.price
                
              }}  
              /> 
          
{quantity_alert(lineItem)}
            <span > Unit Price: ${lineItem.price}</span> <span style={{float :"right"}} >Line Total:${lineItem.lineTotal}</span><br/>            
            <br/>
           <div className={lineItem.showInfo ? 'calculations' : 'hidden calculations'}>
              <span className='infoclose' onClick={() => closeinfo(lineItem)} >  <FontAwesomeIcon icon={faCircleXmark}   /></span>
            <div>Calculation: {lineItem.formula}</div>
            <div>Waste:
              <input autoComplete="off"           
                  value={lineItem.waste}
                  {...register(`product.${lineItem.lineNumber}.waste`)}
                  onChange={(e) => {
                      updateItem(lineItem, 0, e.target.value)
                  }}  
                  style={{width:"40px"}}                     
              /><span>%</span>&nbsp;&nbsp;&nbsp;&nbsp;
              Calculated Waste: { (calc_qty(lineItem) * lineItem.waste / 100).toFixed(2)}
            </div> 
            <div>Total Calculations (Qty +  Waste): {lineItem.originalQuantity}</div>
            </div> 
            </div>)
            
            })}    
             
            </div>
            
        <Button disabled={loading || !materialsList || materialsList.length === 0}  type='submit' className='me-1' color='primary'>
          Save
        </Button>
        <span style={{float :"right"}} >Materials Total: ${materialTotal()}</span>
        
        
            </Form>
            </div>
            </CardBody>
            </Card>
  </Fragment>
)
}

export default MaterialsCard