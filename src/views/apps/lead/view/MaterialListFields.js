/*eslint-disable no-unused-vars */
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, FormFeedback} from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors, calculateQuantity } from '@utils'
import { Controller, useFormContext, useFieldArray, useWatch } from 'react-hook-form'
import Cleave from 'cleave.js/react' 
import NumberInputControlled from 'rc-input-number'
import { Plus, Minus } from 'react-feather'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react' 
import { string } from 'prop-types'
const formatter = new Intl.NumberFormat('en-US', { //javascript built in number formatting
  style: 'currency',
  currency: 'USD'
})

const MaterialListFields = () => {

  const {control, errors, getValues, setValue, watch} = useFormContext()
  const [openedRowIndex, setOpenedRowIndex] = useState(null)

    const SelectThemed = (props) => (
      <Select 
         className='react-select'
         classNamePrefix='select'
         theme={selectThemeColors}
         {...props}
     />)

    const colorOptions = (product) => {   
      if (product?.colors) {
          return product.colors.map((li) => {
            return { value: li.name, label: li.name }
          })
      }
      return []
    }

    const getOptionValue = (arr, value) => {
      const rs = arr.filter(itm => itm.value === value)
      return rs
    }

    const IntFormattingInput = ({onChange, onBlur, ...props}) => {
      const options = { 
        numeral: true, 
        numeralPositiveOnly: true,
        numeralThousandsGroupStyle: 'thousand'
      }

      const handleOnChange = (e) => {
        if (!onChange) return
        if (e?.target?.value && e?.target?.value.length > 0) {
          onChange(parseInt(e.target.value.replace(/,/g, '')))
        } else {
          onChange(null)
        }
      }

      const handleOnBlur = (e) => {
        if (!onBlur) return
        if (e?.target?.value && e?.target?.value.length > 0) {
          onBlur(parseInt(e.target.value.replace(/,/g, '')))
        } else {
          onBlur(null)
        }
      }

      return (
          <Cleave className='form-control' options={options} {...props} onChange={handleOnChange} onBlur={handleOnBlur}/>
      )
    }

    const DecimalFormattingInput = ({onChange, onBlur, ...props}) => {
      const options = { 
        numeral: true, 
        numeralPositiveOnly: true,
        numeralThousandsGroupStyle: 'thousand'
      }

      const handleOnChange = (e) => {
        if (!onChange) return
        if (e?.target?.value && e?.target?.value.length > 0) {
          onChange(parseFloat(e.target.value.replace(/,/g, '')))
        } else {
          onChange(null)
        }
      }

      const handleOnBlur = (e) => {
        if (!onBlur) return
        if (e?.target?.value && e?.target?.value.length > 0) {
          onBlur(parseFloat(e.target.value.replace(/,/g, '')))
        } else {
          onBlur(null)
        }
      }

      return (
          <Cleave className='form-control' options={options} {...props} onChange={handleOnChange} onBlur={handleOnBlur}/>
      )
    }

    const SelectColor = ({item, index}) => {
      const colors = colorOptions(item.product)

      if (colors.length === 0) {
        return
      }
      const name = `materialList.${index}.color`

      const proprogateColor = (value, onChange) => {
        onChange(value)

        const materialList = getValues('materialList')
        materialList.forEach((itm, i) => {
          if (itm.product?.colors) {
            const colorAvail = itm.product.colors.filter((c) => c.name === value)
            if (colorAvail && colorAvail.length > 0) {
              // console.log('set color', i, value)
              setValue(`materialList.${i}.color`, value)
            }
          }
        })
      }

      return (
        <>
          <Label className='form-label' for={`materialList.${index}.color`}>
            Color
          </Label>
          <Controller
            control={control}
            name={`materialList.${index}.color`}
            render={({ field:{value, name, onChange} }) => {
                return (
                    <SelectThemed
                    name={name}
                    onChange={(newValue) => proprogateColor(newValue.value, onChange)}
                    value={getOptionValue(colors, value)}
                    options={colors}
                    isClearable={false}
                    
              />)
    
              }}
            />
        </>
      )
  } 

    const renderListItem = (item, index) => {

      //const watchExtPrice = useWatch({name:`materialList.${index}.extPrice`})
      //const watchCalcWasteQty = useWatch({name:`materialList.${index}.calcWasteQty`})
      //const watchCalcWastePlusQty = useWatch({name:`materialList.${index}.calcWastePlusQty`})
      const watchExtPrice = watch(`materialList.${index}.extPrice`)
      const watchCalcWasteQty = watch(`materialList.${index}.calcWasteQty`)
      const watchCalcWastePlusQty = watch(`materialList.${index}.calcWastePlusQty`)
      
      let uom = null

      if (item.product?.uoms) {
        // console.log(item.product.uoms)
        uom = item.product.uoms.find((itm) => itm.uom === item.uom)
        if (!uom) {
          uom = {}
        }
      }

      const calcWaste = () => {
        const calcQty = getValues(`materialList.${index}.calcQuantity`)
        const wastePercent = getValues(`materialList.${index}.wastePercent`)
        return Math.round((calcQty ?? 0) * ((wastePercent ?? 0) / 100) * 100) / 100
      }

      const calcWastePlusQty = () => {
        const calcQty = getValues(`materialList.${index}.calcQuantity`)
        const waste = calcWaste()
        return Math.round(((waste ?? 0) + (calcQty ?? 0)) * 100) / 100
      }
      
      const recalcExtPrice = () => {
        const quantity = getValues(`materialList.${index}.quantity`)
        setValue(`materialList.${index}.extPrice`, Math.round(quantity * uom.price * 100) / 100)
      }

      const recalcWaste = () => {
        const wastePlusQty = calcWastePlusQty()
        setValue(`materialList.${index}.calcWasteQty`, calcWaste())
        setValue(`materialList.${index}.watchCalcWastePlusQty`, wastePlusQty)
        setValue(`materialList.${index}.quantity`, Math.ceil(wastePlusQty))
        recalcExtPrice()
      }

      const calcFormulaText = () => {
        const parts = []
        let total = 0
        let packageUom = null
        let packageQty = null

        if (item.subComponents) {
          for (const materialType in item.subComponents) {
            const comp = item.subComponents[materialType]
            if (comp.total === 0) {
              continue
            }
            total = total + comp.total
            packageUom = comp.packageUom
            packageQty = comp.packageQty
            parts.push(`${materialType}(${comp.total})`)
          }
        }

        let calcTotal = 0
        if (total > 0) {
          calcTotal = Math.round(total / packageQty * 100) / 100 
        }

        if (parts.length > 1) {
          return `( ${parts.join(' + ')} ) / ${packageQty} ${packageUom} = ${calcTotal}`
        } else if (parts.length > 0) {
          return `${parts.join(' + ')} / ${packageQty} ${packageUom} = ${calcTotal}`
        }
        return null
      }

      const handleQuantityOnFocus = () => {
        setOpenedRowIndex(index)
      }

      const selectedRowStyle = {}
      if (openedRowIndex === index) {
        selectedRowStyle.backgroundColor = '#f9f9f9'
      }

      return (
        <div md={12} xs={12} style={{borderTop: "dashed 1px black", paddingTop: "10px", paddingBottom: "10px", ...selectedRowStyle }} key={index}>
          <Row> 
            <Col xl={4} lg={12} md={12} xs={12}>
              <Label className='form-label' for={`materialList.${index}.sku`}>
                {item.product.category}
              </Label>
              <input
                className='form-control' 
                value={item.product.description}
                disabled={true}
                />
            </Col>
            <Col xl={2} lg={2} md={4} xs={4}>
             {/*{selectColor(item, index)}*/}
             <SelectColor item={item} index={index} />
            </Col>
            <Col xl={2} lg={2} md={4} xs={4}>
              <Label className='form-label' for='materialList.${index}.quantity'>
                Quantity ({getValues(`materialList.${index}.uom`)})
              </Label>
              <div>
                <Controller
                  control={control}
                  name={`materialList.${index}.quantity`}
                  render={({field:{ref, onBlur, ...rest}}) => {
                      return (
                        <IntFormattingInput {...rest} htmlRef={ref} onFocus={handleQuantityOnFocus} onBlur={
                          (e) => {
                            onBlur(e)
                            recalcExtPrice()
                          }
                        }/>
                      )
                    }}
                />
                {getValues(`materialList.${index}.quantity`) !== Math.ceil(watchCalcWastePlusQty ?? calcWastePlusQty()) && (
                  <div className='quantity-alert'>
                  * Calculated: {Math.ceil(watchCalcWastePlusQty ?? calcWastePlusQty())}
                  </div>
                )}
              </div>
            </Col>
            <Col xl={2} lg={2} md={4} xs={4}>
              <Label className='form-label' for={`materialList.${index}.cost`}>
                Cost
              </Label>
              <input
                name={`materialList.${index}.extPrice`}
                className='form-control'
                value={formatter.format(watchExtPrice ?? (item.quantity * uom.price))}
                disabled={true}
              />
            </Col>
          </Row> 
          {openedRowIndex === index && (
            <Row>
              <Col sm={4} xs={12}> 
                  <Label className='form-label' for={`materialList.${index}.formula`}>
                    Formula
                  </Label>
                  <input
                    name={`materialList.${index}.formula`}
                    className='form-control' 
                    disabled={true}
                    value={calcFormulaText()}
                  /> 
              </Col>
              <Col sm={1} xs={6}>
                <Label className='form-label' for='materialList.${index}.wastePercent'>
                  % of Waste
                </Label>
                <Controller
                  control={control}
                  name={`materialList.${index}.wastePercent`}
                  render={({field:{ref, onBlur, ...rest}}) => {
                      return (
                        <DecimalFormattingInput {...rest} htmlRef={ref} onBlur={
                          (e) => {
                            onBlur(e)
                            recalcWaste()
                          }
                        }/>
                      )
                    }}
                />
              </Col>
              <Col sm={1} xs={6}>
                <Label className='form-label' for={`materialList.${index}.calcWasteQty`}>
                  Calc Waste
                </Label>
                <input
                    name={`materialList.${index}.calcWasteQty`}
                    className='form-control' 
                    value={(watchCalcWasteQty ?? calcWaste())}
                    disabled={true}
                />
              </Col>
              <Col sm={2} xs={6}>
                <Label className='form-label' for={`materialList.${index}.calcWastePlusQty`}>
                  Qty + Waste
                </Label>
                <input
                    name={`materialList.${index}.calcWastePlusQty`}
                    className='form-control' 
                    value={(watchCalcWastePlusQty ?? calcWastePlusQty())}
                    disabled={true}
                />        
              </Col>
              <Col  sm={2} xs={6}>
                <Label className='form-label' for={`materialList.${index}.price`}>
                Unit Price
                </Label>
                <input
                    name={`materialList.${index}.price`}
                    className='form-control' 
                    disabled={true}
                    value={formatter.format(uom.price)}
                />        
              </Col>
            </Row>
          )}
      </div>
      )
    }

    const renderList = () => {

      const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: "materialList" // unique name for your Field Array
      })

      return fields.map(renderListItem)
    }

    const renderTotal = () => {
      const materialList = getValues('materialList') 
      
      let totalCost = 0
      if (materialList) {
        
        materialList.forEach(item => {
          let uom = null

          if (item.product?.uoms) {
            //console.log(item.product.uoms)
            uom = item.product.uoms.find((itm) => itm.uom === item.uom)
            if (!uom) {
              uom = {}
            }
          }
          totalCost = totalCost + (item.extPrice ?? (item.quantity * uom.price))
        })
      }

      return totalCost
    }
    
    return (
      <div  className='gy-1 pt-75'>
        {renderList()}
        <Row>
          <Col>
          Total: {formatter.format(renderTotal())}
          </Col>
        </Row>
      </div>
    )
}

export default MaterialListFields