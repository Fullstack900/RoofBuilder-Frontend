import React, { useState, useEffect, useRef } from "react"
import {Input} from 'reactstrap'

const SearchLocationInput = ({onChange, value, ...rest}) => {
  const [query, setQuery] = useState(value)
  const autoCompleteRef = useRef(null)

  let autoComplete

  async function handlePlaceSelect(updateQuery) {
    // Get the place details from the autocomplete object.
    const place = autoComplete.getPlace()
    const address_components = place.address_components
    let houseNumber = ""
    let street = ""
  
    const result = {}
    for (let ac = 0; ac < address_components.length; ac++) {
        const item = address_components[ac]
        
        if (item.types.includes("street_number")) {
            houseNumber = item.short_name
        } else if (item.types.includes("route")) {
            street = item.short_name
        } else if (item.types.includes("administrative_area_level_1")) {
          result.state = item.short_name
        } else if (item.types.includes("locality")) {
          result.city = item.short_name
        } else if (item.types.includes("postal_code")) {
          result.zip = item.short_name
        }
    }
  
    result.street_address = `${houseNumber} ${street}`
    updateQuery(result.street_address)
    if (onChange) {
      onChange(result)
    }
  }

  function handleScriptLoad(updateQuery, autoCompleteRef) {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      { types: ["geocode"], componentRestrictions: { country: "us" } }
    )
    autoComplete.setFields(["address_components", "formatted_address"])
    autoComplete.addListener("place_changed", () => handlePlaceSelect(updateQuery))
  }

  useEffect(() => {
    handleScriptLoad(setQuery, autoCompleteRef)
  }, [])

  return (
    <div className="search-location-input">
      <Input
        innerRef={autoCompleteRef}
        onChange={event => { onChange(event.target.value); setQuery(event.target.value) } }
        value={query}
        {...rest}
      />
    </div>
  )
}

export default SearchLocationInput