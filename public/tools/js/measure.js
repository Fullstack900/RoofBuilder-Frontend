
var dbMeasurement=dbProject.measurement ?? {}
            
            var map;
            var jobID = dbProject._id;            
            var snap_status = "{{@$user->snap_point}}";
            // var measurementID = "{{$measurement->id}}";
           // var areasDB = "{{$measurement->areas}}";
           /// var linesDB = "{{$measurement->lines}}";
            //var markersDB = "{{$measurement->markers}}";
            var pointsDB = "";
            // var fullAddress = "{{$job->address_line_1}}";
            var fullAddress = dbProject.address_line_1+", "+dbProject.city+", " + dbProject.state+", "+dbProject.zip;


            // var fullAddress = "5876 West 10620 North";
            var waste = dbMeasurement.waste ?? 15;
            if(waste == 0 || waste == ""){
                waste = 15
            }

            var manualedited = dbMeasurement.edited;
            $("#wasteOpt").val(waste)
            var pitch = dbMeasurement.pitch;
            //var location1 =  "/jobs/"+dbProject._id;
            // var areas = {orgin: [], area : [], layer : [], pitch : [], tools : [] };
            var oldPathColor = "#3388ff";
            var oldPathWidth = 3;
            var hoverColor = 'red';
            var hoverWidth = 5;
            var tempVal = 0;
            var totalArea = 0;
            var infodiv = $('.totalAreaDisplay .res');
            var height = infodiv.height();
            var leaflet_id_pitch = null;
            var editLayers = [];
            var init = false;
            const damageTools   = ['Leak Area', 'Hail Damage', 'Wind Damage', 'Shingle Defect'];
            const ventTools = [
                               "Box Vent",
                                "Chimney Cricket",
                                "Power Fan",
                                "pipe boot 2 inch",
                                "pipe boot 3 inch",
                                "pipe boot 4 inch",
                                "Turbine Vent",
                            ]
            // For dynamic options
            const damageOptions = [
                                    '<option value="">Damage Type</option>',
                                    '<option value="Leak Area">Leak Area</option>',
                                    '<option value="Hail Damage">Hail Damage</option>',
                                    '<option value="Wind Damage">Wind Damage</option>',
                                    '<option value="Shingle Defect">Shingle Defect</option>',
                                    ];
            const VentOptions = [
                                    '<option value="">Vent Type</option>',
                                    '<option value="Box Vent">Box Vent</option>',
                                    '<option value="Chimney Cricket">Chimney Cricket</option>',
                                    '<option value="Power Fan">Power Fan</option>',
                                    '<option value="pipe boot 2 inch">pipe boot 2 inch</option>',
                                    '<option value="pipe boot 3 inch">pipe boot 3 inch</option>',
                                    '<option value="pipe boot 4 inch">pipe boot 4 inch</option>',
                                    '<option value="Turbine Vent">Turbine Vent</option>',
                                    '<option value="Skylights">Skylights</option>',
                                    ];
            // var layerVisibility = []
            var db = {
                        areaOriginal :[],
                        area :[],
                        areaTool:[],
                        areaStories : [],
                        areaPitch:[],
                        areaLayer : [],
                        areaVisibility : [],
                        areaOriginal :[],
                        areaSegments : [],
                        line:[],
                        lineTool:[],
                        linePitch:[],
                        lineLayer:[],
                        lineVisibility : [],
                        lineOriginal:[],
                        marker :[],
                        markerTool:[],
                        markerFor:[],
                        markerLayer : [],
                        markerVisibility : [],
                        markerOriginal:[],
                    };
                    
            const LineTools = ['Ridge','Hip','Rake','Valley','Eave','Circle','Step-flashing','Base-flashing','Poly Plus'];
            const MarkerTools = ['Storm-Damage','Vent'];
            // Create Actions for custom controls
            const markerActions = ['cancel'];
            const lineActions = ['finish', 'removeLastVertex','cancel'];
            console.log("before",linesDB);
            
            var areasDB = dbMeasurement.areas;
            var linesDB = dbMeasurement.lines;
            
            var markersDB = dbMeasurement.markers;
            var newJSON = dbMeasurement.toolJSON;

            console.log("after",linesDB);
            $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+fullAddress+"&key=AIzaSyAaj2C3E1Oa8mm6SWCv7VUDUddg3m2FKhI", function(data, status){

                if(data['status'] == 'OK'){

                    results = data['results'][0];
                    lat     = results.geometry.location.lat
                    lng     = results.geometry.location.lng

                     //====================Test Street View Map ============================================

                        panorama = new google.maps.StreetViewPanorama(document.getElementById('map'), {
                            position: { lng: lng, lat: lat },
                            pov: { heading: 0, pitch: 0 },
                            addressControl: false,
                            linksControl: true, // guide arrows
                            panControl: true, // compass
                            zoomControl: false,
                            /*
                            zoomControlOptions: {
                                position: google.maps.ControlPosition.LEFT_TOP
                            },*/
                            fullscreenControl: false,
                            fullscreenControlOptions: {
                                position: google.maps.ControlPosition.LEFT_TOP
                            },
                            zoom: 1,
                            visible: false,
                            mode: 'html5' // fixes bug in FF: http://stackoverflow.com/questions/28150715/remove-google-street-view-panorama-effect
                        });

                    //====================================================

                    L.mapbox.accessToken = 'pk.eyJ1IjoidGVjaG5vdGVzdGluZ3RlYW0iLCJhIjoiY2tkeWhvanRsMWk1dTJ6bnNncGExdnZndiJ9.lyC4_8Nikiw9DXe8LR3a6A';
                    map = L.map('map').setView([lat, lng], 20);

                    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVjaG5vdGVzdGluZ3RlYW0iLCJhIjoiY2tkeWhvanRsMWk1dTJ6bnNncGExdnZndiJ9.lyC4_8Nikiw9DXe8LR3a6A', {
                        maxZoom: 22,
                        minZoom: 2,
                        attribution: 'Map data: {attribution.OpenStreetMap}, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    }).addTo(map);

                    L.marker([lat, lng], { pmIgnore: true }).addTo(map);
                    // addFeature(p1);

                    let detailLevel = new L.Control.DetailLevel(0, 3);
                    detailLevel.addTo(map);

                    map.pm.enableGlobalRemovalMode();


                    // Controls
                    map.pm.addControls({
                        drawMarker: false,
                        drawCircle: false,
                        drawRectangle: false,
                        drawCircleMarker : false,
                        drawPolygon: false,
                        editPolygon: true,
                        drawPolyline: false,
                        drawPolylinePlus: false,
                        deleteLayer: true,
                        customControls: true,
                    });

                    map.on('pm:globaldrawmodetoggled ', e => {
                        var shaping = e.shape

                        if(shaping == "polygon"){
                            $(".toggle-message").removeClass("hide")
                        }else{
                            $(".toggle-message").addClass("hide")
                        }
                    });
                    function checkDupes(cords)
                    {
                        let dupefound=false
                        db.lineLayer.forEach(llayer => {
        let p1 =llayer._latlngs[0].lng;
        let p2 =llayer._latlngs[0].lat;

        let p3 =llayer._latlngs[1].lng;
       let p4 =llayer._latlngs[1].lat;
       //console.log(p1,p2,p3,p4);
       //c//onsole.log(cords);
       
        if(cords[0][0]===p1 && cords[0][1]==p2 && cords[1][0]===p3 && cords[1][1]==p4)
        {
            console.log("Duplicate!!!");
            dupefound=true;
        }
        if(cords[0][0]===p3 && cords[0][1]==p4 && cords[1][0]===p1 && cords[1][1]==p2)
        {
            console.log("back wards duplicate!!!");
            dupefound=true;
        }
                             // console.log(cords);
                        })
                        console.log(dupefound);
                        return dupefound;
                    }
                    function updateLineDB(shape,selectedLayer)
                    {                   
                        console.log(getAreaOrLength(shape,selectedLayer));
                         db['lineOriginal'].push(getAreaOrLength(shape,selectedLayer));
                    db['line'].push(getAreaOrLength(shape,selectedLayer));
                    db['lineTool'].push(shape);
                    db['lineLayer'].push(selectedLayer);
                    db['lineVisibility'].push(true);
                }
function polygonPlus(layer)
{
//console.log(layer._latlngs[0])
 let p =$("#globalPitch").val();
    var cords = [];
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);

  if(checkDupes(cords)===false)
  {// extra features (feature.tool,layer,feature.pitch,feature.sub_tool);
    var eave = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Eave"),
            "tool"      : "Eave",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    var neweave=addFeature(eave);
    var eavelayer=Object.values(neweave._layers)[0];
    console.log(neweave._leaflet_id);
    //updateLineDB("Eave",eavelayer);
    
    showPopUp(getAreaOrLength("Eave",eavelayer),neweave._leaflet_id);
  }
    cords = [];
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);

  if(checkDupes(cords)===false)
  {
    var rake1 = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Rake"),
            "tool"      : "Rake",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    var newrake1=addFeature(rake1);
    var rake1layer=Object.values(newrake1._layers)[0];
    
    
    showPopUp(getAreaOrLength("Rake",rake1layer),newrake1._leaflet_id);
//setOrigins("Rake",newrake1);
}
    cords = [];
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);
    cords.push([layer._latlngs[0][3].lng,layer._latlngs[0][3].lat]);
    if(checkDupes(cords)===false)
  {
    var ridge = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Ridge"),
            "tool"      : "Ridge",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    var newridge = addFeature(ridge);

    var ridge2layer=Object.values(newridge._layers)[0];
    
    
    showPopUp(getAreaOrLength("Rake",ridge2layer),newridge._leaflet_id);
   // setOrigins("Ridge",newridge);
  }
    cords = [];
    cords.push([layer._latlngs[0][3].lng,layer._latlngs[0][3].lat]);
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    if(checkDupes(cords)===false)
  {
    var rake2 = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Rake"),
            "tool"      : "Rake",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    var newrake2 = addFeature(rake2);
   //S setOrigins("Rake",newrake2);

   var rake2layer=Object.values(newrake2._layers)[0];
    
    
    showPopUp(getAreaOrLength("Rake",rake2layer),newrake2._leaflet_id);
}
}
function polygonPlus2(layer)
{
//eave hip ridge hip //
let p =$("#globalPitch").val();
    var cords = [];
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);

  if(checkDupes(cords)===false)
  {
    var eave = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Eave"),
            "tool"      : "Eave",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(eave);
  }
    cords = [];
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);

  if(checkDupes(cords)===false)
  {
    var hip1 = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Hip"),
            "tool"      : "Hip",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(hip1);
}
    cords = [];
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);
    cords.push([layer._latlngs[0][3].lng,layer._latlngs[0][3].lat]);
    if(checkDupes(cords)===false)
  {
    var ridge = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Ridge"),
            "tool"      : "Ridge",
            "size"    : 1,
            "pitch"    :p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(ridge);
  }
    cords = [];
    cords.push([layer._latlngs[0][3].lng,layer._latlngs[0][3].lat]);
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    if(checkDupes(cords)===false)
  {
    var hip2 = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Hip"),
            "tool"      : "Hip",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(hip2);
}
}
function polygonPlus3(layer)
{
//Poly+ Hip Triangle (Eave, Hip, Hip)
let p =$("#globalPitch").val();
    var cords = [];
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);

  if(checkDupes(cords)===false)
  {
    var eave = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Eave"),
            "tool"      : "Eave",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(eave);
  }
    cords = [];
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);

  if(checkDupes(cords)===false)
  {
    var hip1 = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Hip"),
            "tool"      : "Hip",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(hip1);
}
    cords = [];
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
 
    if(checkDupes(cords)===false)
  {
    var hip2 = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Hip"),
            "tool"      : "Hip",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(hip2);
}
}

function polygonPlus4(layer)
{
//ePoly+ Dormer (Eave, Valley, Ridge, Rake)
let p =$("#globalPitch").val();
    var cords = [];
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);

  if(checkDupes(cords)===false)
  {
    var eave = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Eave"),
            "tool"      : "Eave",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(eave);
  }
    cords = [];
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);

  if(checkDupes(cords)===false)
  {
    var valley = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Valley"),
            "tool"      : "Valley",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(valley);
}
    cords = [];
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);
    cords.push([layer._latlngs[0][3].lng,layer._latlngs[0][3].lat]);
    if(checkDupes(cords)===false)
  {
    var ridge = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Ridge"),
            "tool"      : "Ridge",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(ridge);
  }
    cords = [];
    cords.push([layer._latlngs[0][3].lng,layer._latlngs[0][3].lat]);
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    if(checkDupes(cords)===false)
  {
    var rake1 = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Rake"),
            "tool"      : "Rake",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(rake1);
}
}
function polygonPlus5(layer)
{
//Poly+ Dormer No Eaves (Valley, Ridge, Rake)
let p =$("#globalPitch").val();
    var cords = [];
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);

  if(checkDupes(cords)===false)
  {
    var valley = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Valley"),
            "tool"      : "Valley",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(valley);
  }
    cords = [];
    cords.push([layer._latlngs[0][1].lng,layer._latlngs[0][1].lat]);
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);

  if(checkDupes(cords)===false)
  {
    var ridge = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Ridge"),
            "tool"      : "Ridge",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(ridge);
}
    cords = [];
    cords.push([layer._latlngs[0][2].lng,layer._latlngs[0][2].lat]);
    cords.push([layer._latlngs[0][0].lng,layer._latlngs[0][0].lat]);
 
    if(checkDupes(cords)===false)
  {
    var rake = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "color": getColor("Rake"),
            "tool"      : "Rake",
            "size"    : 1,
            "pitch"    : p,
            "geometry": {
                "type": "LineString",
                "coordinates": cords
            }
        }]
    }
    addFeature(rake);
}
}
                    // Create Shapes from leaflet menu tool
                    map.on('pm:create',function (e) {
                        console.log("on create");
                        let shape=e.shape;

                   let selector="div[data-original-title='"+shape+"'] a";//this is the tool to set it back to active
                   if(shape==="polygon") 
                        {
                            selector="div[data-original-title='Polygon'] a";
                        }
                        if(e.shape.search("polygonplus") >-1)
                        {//generate into lines seperatley 

                        
                          
                            
                            switch(shape)
                            {
                                case "polygonplus1":
                                    selector="div[data-original-title='Poly+ (Eave, Rake, Ridge, Rake)'] a";
                                    polygonPlus(e.layer);
                                    break;
                                case "polygonplus2":
                                    polygonPlus2(e.layer);
                                    selector="div[data-original-title='Poly+ Hip Area (Eave, Hip, Ridge, Hip)'] a";
                                    break;
                                case "polygonplus3":
                                    polygonPlus3(e.layer);
                                    selector="div[data-original-title='Poly+ Hip Triangle (Eave, Hip, Hip)'] a";
                                    break;                                    
                                case "polygonplus4":
                                    polygonPlus4(e.layer);
                                    selector="div[data-original-title='Poly+ Dormer (Eave, Valley, Ridge, Rake)'] a";
                                    break;
                                case "polygonplus5":
                                    polygonPlus5(e.layer);
                                    selector="div[data-original-title='Poly+ Dormer No Eaves (Valley, Ridge, Rake)'] a";
                                    break;

                            }
                           
                            shape = "polygon";// we still need to make a polygon
                        }

                        let selectedLayer=e.layer;
                        // Set Areas data to local variable
                        setOrigins(shape,selectedLayer);

                        showPopUp(getAreaOrLength(shape,selectedLayer),selectedLayer._leaflet_id);

                        if(MarkerTools.indexOf(shape) != -1)
                        {
                            showDamagePopup(shape,selectedLayer._leaflet_id);
                        }

                        selectedLayer.on('mouseup mouseout',function(e) {
                            hoverEffectOnShapesDisable(selectedLayer._leaflet_id);
                        });

                        selectedLayer.on('mousedown',function(e) {
                            let index = "";
                            let measure = "";
                            console.log("mouse down");
                            hoverEffectOnShapesEnable(selectedLayer._leaflet_id);
                            if(db.lineLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id) != -1 )
                            {
                                index = db.lineLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                                measure = db.lineOriginal[index];
                            } else {
                                index = db.areaLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                                measure = db.areaOriginal[index];
                            }

                            if(MarkerTools.indexOf(shape) != -1)
                            {
                                showDamagePopup(shape,selectedLayer._leaflet_id);
                            }
                            
                            showPopUp(measure,selectedLayer._leaflet_id);
                        });


                        // Edit Functionality
                        selectedLayer.on('pm:edit', e => {

                            updateOrigins(shape,selectedLayer)

                            selectedLayer.on('mouseup mouseout',function(e) {
                                hoverEffectOnShapesDisable(selectedLayer._leaflet_id);
                            });

                            selectedLayer.on('mousedown',function(e) {
                                hoverEffectOnShapesEnable(selectedLayer._leaflet_id);
                                showPopUp(getAreaOrLength(shape,selectedLayer),selectedLayer._leaflet_id);
                            });

                            showTotalSelectedArea();

                        });

                        selectedLayer.on('pm:remove',function(e){                            

                            removeOrigins(shape,selectedLayer)
                            showTotalSelectedArea();
                        });
                        // Delete functionality

                        selectedLayer.on('pm:remove',function(e){
                            
                            removeOrigins(shape,selectedLayer)
                            showTotalSelectedArea();
                        });

                        selectedLayer.on('pm:globaldrawmodetoggled',function(e){
                            
                        });

                        selectedLayer.on('pm:markerdragend', function(e){
                            
                        });


                        // Make top if line is there

                        // if(LineTools.indexOf(shape) == -1){
                        db.lineLayer.length > 0 ? db.lineLayer.forEach(layer => {
                               layer.bringToFront();
                        }) : null;
                        // }
                        console.log(shape);
                     
                        //reset the tool to the same data-original-title="Base-flashing"

               
                        setTimeout(() => {
                           document.querySelector(selector).click();
                        }, "200");

                    //    selectedLayer.openPopup();

                    });


                    map.pm.Toolbar.createCustomControl(
                    {
                        className : 'leaflet-pm-toolbar mi-tooltip fa-icon fas fa-list',
                        name:'Drawing Measurements',
                        block: 'draw',
                        title: 'Drawing Measurements',
                        toggle : false,
                        onClick : (e) => {
                            $('.totalAreaDisplay').toggle();

                        }
                    }
                    );
                    map.pm.Toolbar.createCustomControl(
                    {
                        className : 'fas fa-street-view setMapToggle',
                        name:'Pitch Tool',
                        block: 'draw',
                        title: 'Pitch Tool',
                        toggle : false,
                        onClick:(e)=>{
                            $("div.setMapToggle").toggleClass('fa-street-view fa-map');
                            $("div.setMapToggle").attr('title','Pitch Tool')
                            panorama.setVisible(false)
                            if($("div.setMapToggle").hasClass('fa-map'))
                            {
                                $("#gauge").show();
                                $('.pitch-gauge-position').removeClass('hide');
                                $(".setMapToggle").attr('title','Satellite View')
                                panorama.setVisible(true)
                            } else {
                                $('.pitch-gauge-position').addClass('hide');
                                $("#gauge").hide();
                                map.panTo([lat, lng ], 20)
                            }
                        }
                    }
                    );

                    // map.pm.Toolbar.copyDrawControl('Rectangle',
                    // {
                    //     // className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline eaveTool',
                    //     name:'rectangle',
                    //     block: 'draw',
                    //     title: 'Rectangle',
                    //     actions: lineActions
                    // }
                    // );

                    map.pm.Toolbar.createCustomControl({
                        className : 'leaflet-pm-toolbar mi-tooltip fas fa-building',
                        name:'global_pitch',
                        block: 'draw',
                        title: 'Global Pitch',
                        toggle : false,
                        onClick : (e) => {
                           e.preventDefault();
                           $('.setPitch').toggle();
                        }
                    });

                    map.pm.Toolbar.copyDrawControl('Polygon',
                    {
                        // className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline eaveTool',
                        name:'polygon',
                        block: 'draw',
                        title: 'Polygon',
                        actions: lineActions
                    }
                    );
                    map.pm.Toolbar.copyDrawControl('Polygon',
                    {
                        //className :'polygonplus1',
                        name:'polygonplus1',
                        block: 'draw',
                        title: 'Poly+ (Eave, Rake, Ridge, Rake)',
                        actions: lineActions
                    }
                    );/*
                    map.pm.Toolbar.copyDrawControl('Polygon',
                    {
                        // className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline eaveTool',
                        name:'polygonplus2',
                        block: 'draw',
                        title: 'Poly+ Hip Area (Eave, Hip, Ridge, Hip)',
                        actions: lineActions
                    }
                    );
                    map.pm.Toolbar.copyDrawControl('Polygon',
                    {
                        // className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline eaveTool',
                        name:'polygonplus3',
                        block: 'draw',
                        title: 'Poly+ Hip Triangle (Eave, Hip, Hip)',
                        actions: lineActions
                    }
                    );
                    map.pm.Toolbar.copyDrawControl('Polygon',
                    {
                        // className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline eaveTool',
                        name:'polygonplus4',
                        block: 'draw',
                        title: 'Poly+ Dormer (Eave, Valley, Ridge, Rake)',
                        actions: lineActions
                    }
                    );
                    map.pm.Toolbar.copyDrawControl('Polygon',
                    {
                        // className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline eaveTool',
                        name:'polygonplus5',
                        block: 'draw',
                        title: 'Poly+ Dormer No Eaves (Valley, Ridge, Rake)',
                        actions: lineActions
                    }
                    );
*/
                    // copy a rectangle and customize its name, block, title and actions
                    map.pm.Toolbar.copyDrawControl('Line',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline ridgeTool',
                        name:'Ridge',
                        block: 'draw',
                        title: 'Ridge',
                        actions: lineActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('Line',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline hipTool',
                        name:'Hip',
                        block: 'draw',
                        title: 'Hip',
                        actions: lineActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('Line',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline rakeTool',
                        name:'Rake',
                        block: 'draw',
                        title: 'Rake',
                        actions: lineActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('Line',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline valleyTool',
                        name:'Valley',
                        block: 'draw',
                        title: 'Valley',
                        actions: lineActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('Line',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline eaveTool',
                        name:'Eave',
                        block: 'draw',
                        title: 'Eave',
                        actions: lineActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('Line',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline step-flashing',
                        name:'Step-flashing',
                        block: 'draw',
                        title: 'Step-flashing',
                        actions: lineActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('Line',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-polyline',
                        name:'Base-flashing',
                        block: 'draw',
                        title: 'Base-flashing',
                        actions: lineActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('drawCircleMarker',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-circle ventTool',
                        name:'Vent',
                        block: 'draw',
                        title: 'Vent',
                        actions: markerActions
                    }
                    );

                    map.pm.Toolbar.copyDrawControl('drawCircleMarker',
                    {
                        className :'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-circle ridgeTool',
                        name:'Storm-Damage',
                        block: 'draw',
                        title: 'Storm-Damage',
                        actions: markerActions
                    },

                    );

                    map.pm.Toolbar.createCustomControl(
                        {
                            className : 'leaflet-pm-toolbar mi-tooltip leaflet-pm-icon-marker',
                            name:'Hide/Show Marker',
                            block: 'custom',
                            title: 'Hide/Show Marker',
                            toggle : true,
                            onClick : (e) => {

                                $('.leaflet-pane').find('.leaflet-marker-pane').toggleClass('d-none');
                            }
                        }
                    );
                   map.pm.Toolbar.createCustomControl({
                        className : 'leaflet-pm-toolbar mi-tooltip fa-icon fas fa-cog',
                        name:'Waste',
                        block: 'custom',
                        title: 'Set Waste',
                        toggle : false,
                        onClick : (e) => {
                           e.preventDefault();
                           $("#wasteTool").show();
                        }
                    });



                    map.pm.Toolbar.createCustomControl(
                    {
                        className : 'leaflet-pm-toolbar mi-tooltip fa-icon fas fa-save',
                        name:'Pdf',
                        block: 'custom',
                        title: 'Save & Generate PDF',
                        toggle : false,
                        onClick : (e) => {
                            e.preventDefault();
                            
                            if(manualedited===1)
                            {

                                document.getElementById('show_navigation_btn').style.display='block';
                            }
                            else
                            getCoordinates(false) ;
                        }
                    }
                    );


                    map.pm.Toolbar.createCustomControl(
                    {
                        className : 'leaflet-pm-toolbar mi-tooltip fa-icon fas fa-sign-out-alt',
                        name:'Exit',
                        block: 'custom',
                        title: 'Exit',
                        toggle : false,
                        onClick : (e) => {
                            e.preventDefault();
                            
                            document.getElementById('id01').style.display='block';
                        }
                    }

                    );






                    // ===================================================================
                    //setTool options

                    // Hide tooltip
                    map.pm.setGlobalOptions({ tooltips: false, finishOn : 'dblClick' });
                    map.pm.setGlobalOptions({ snappable: true });
                    map.pm.enableDraw('Ridge', {pathOptions: {color: 'red',dashArray :[1,1]},templineStyle : { color : 'red' },hintlineStyle : { color : 'red' }, finishOn : 'click'});
                    map.pm.enableDraw('Hip', {pathOptions: {color: 'orange',dashArray :[1,1]},templineStyle : { color : 'orange' },hintlineStyle : { color : 'orange' },finishOn : 'dblClick'});
                    map.pm.enableDraw('Rake', {pathOptions: {color: 'green',dashArray :[1,1]},templineStyle : { color : 'green' },hintlineStyle : { color : 'green' },finishOn : 'dblClick'});
                    map.pm.enableDraw('Eave', {pathOptions: {color: 'purple',dashArray :[1,1]},templineStyle : { color : 'purple' },hintlineStyle : { color : 'purple' },finishOn : 'dblClick'});
                    map.pm.enableDraw('Valley', {pathOptions: {color: 'blue',dashArray :[1,1]},templineStyle : { color : 'blue' },hintlineStyle : { color : 'blue' },finishOn : 'dblClick'});
                    map.pm.enableDraw('Step-flashing', {pathOptions: {color: 'teal',dashArray :[1,1]},templineStyle : { color : 'teal' },hintlineStyle : { color : 'teal' },finishOn : 'dblClick'});
                    map.pm.enableDraw('Base-flashing', {pathOptions: {color: 'black',dashArray :[1,1]},templineStyle : { color : 'black' },hintlineStyle : { color : 'black' },finishOn : 'dblClick'});
                    map.pm.enableDraw('Vent', {pathOptions: {color: '#080142',dashArray :[1,1]},templineStyle : { color : '#080142' },hintlineStyle : { color : '#080142' },finishOn : 'click'});
                    map.pm.enableDraw('Storm-Damage', {pathOptions: {color: 'red',dashArray :[1,1]},templineStyle : { color : 'red' },hintlineStyle : { color : 'red' },finishOn : 'click'});



                    //
                    $('.button-container').tooltip({'data-placement':'right'});
                    $('.leaflet-control-zoom a').tooltip({'data-placement':'right'});

                    if((areasDB != null || areasDB != '' || areasDB != undefined) && init != true )
                    {
                        recreateMap();
                        init = true;
                    }
                }
            });

            var snappable = true

            $('body').on('keyup', function(event) {


                if(event.code == 'KeyS'){
                    if(!snappable){
                        $(".toggle-message").html('<b>SNAP IS ON</b> - Shift-S to toggle OFF');


                        map.pm.setGlobalOptions({ snappable: true,limitMarkersToZoom:-1 });
                        snappable = true
                    }else{
                        $(".toggle-message").html('<b>SNAP IS OFF</b> - Shift-S to toggle ON');
                        map.pm.setGlobalOptions({ snappable: false });
                        snappable = false
                    }

                }

            });

        //=======================================================================================
            // CUSTOM FUNCTION FOR MAP

            // Common function to calculate areas
            function getSegmentsOfArea(shape,selectedLayer) {
                let a = 0;
                let segments = [];
                shape = shape.toLowerCase().charAt(0).toUpperCase() + shape.slice(1);
                    var tempLatLng = null;
                    var totalDistance = 0.00000;
                    let firstVertex = '';
                    $.each(selectedLayer._latlngs[0], function(i, latlng){
                                if(i == 0 ){firstVertex = latlng}
                                if(tempLatLng == null){
                                    tempLatLng = latlng;
                                    return;
                                }
                                segments.push(tempLatLng.distanceTo(latlng));
                                tempLatLng = latlng;
                    });
                       segments.push(tempLatLng.distanceTo(firstVertex));
                return  segments;
            }

            function getAreaOrLength(shape,selectedLayer) {
                let a = 0;
                let segments = [];

                shape = shape.toLowerCase().charAt(0).toUpperCase() + shape.slice(1);
                if(LineTools.indexOf(shape) != -1 ){
                    // Calculating the distance of the polyline
                    var tempLatLng = null;
                    var totalDistance = 0.00000;
                    $.each(selectedLayer._latlngs, function(i, latlng){
                        if(tempLatLng == null){
                            tempLatLng = latlng;
                            return;
                        }
                        totalDistance += tempLatLng.distanceTo(latlng);
                        tempLatLng = latlng;
                    });
                    
                    a = (totalDistance).toFixed(2);
                } else if(MarkerTools.indexOf(shape) != -1 ) {
                    a = 0;
                } else {
                    a = LGeo.area(selectedLayer).toFixed(2);
                }
                return a;
            }

            // Store values into the local variabla as the shape drawn
            function setOrigins(shape,selectedLayer)
            {
                if(LineTools.indexOf(shape) != -1 ){
                    db['lineOriginal'].push(getAreaOrLength(shape,selectedLayer));
                    db['line'].push(getAreaOrLength(shape,selectedLayer));
                    db['lineTool'].push(shape);
                    db['lineLayer'].push(selectedLayer);
                    db['lineVisibility'].push(true);
                } else if(MarkerTools.indexOf(shape) != -1 ) {
                    db['markerOriginal'].push(getAreaOrLength(shape,selectedLayer));
                    db['marker'].push(getAreaOrLength(shape,selectedLayer));
                    db['markerTool'].push(shape);
                    db['markerLayer'].push(selectedLayer);
                    db['markerVisibility'].push(true);
                } else if(shape ==='polygonplus' ) {
                    console.log("polly plus")
                    
                }else {
                    db['areaOriginal'].push(getAreaOrLength(shape,selectedLayer));
                    db['area'].push(getAreaOrLength(shape,selectedLayer));
                    db['areaTool'].push(shape);
                    db['areaLayer'].push(selectedLayer);
                    db['areaVisibility'].push(true);
                    db['areaSegments'].push(getSegmentsOfArea(shape,selectedLayer));
                }

                infodiv.animate({scrollTop: height}, 500);
                height += infodiv.height();
            }

            // Update Specific values of variable as the areas changed
            function updateOrigins(shape,selectedLayer)
            {
                if(LineTools.indexOf(shape) != -1 ){
                    index = db.lineLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.line[index] = getAreaOrLength(shape,selectedLayer);
                    db.linePitch[index] = undefined;
                } else if(MarkerTools.indexOf(shape) != -1 ) {
                    index = db.markerLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.marker[index] = getAreaOrLength(shape,selectedLayer);
                    db.markerFor[index] = undefined;
                } else if(shape ==='polygonplus' ) {
                    console.log("pollygon plus")
                }
                else {
                    index = db.areaLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.area[index] = getAreaOrLength(shape,selectedLayer);
                    db.areaPitch[index] = undefined;
                }
            }

            // Store values into the local variabla as the shape drawn
            function setOrigins2(shape,selectedLayer,pitch = 0,sub_tool=undefined)
            {
                if(LineTools.indexOf(shape) != -1 ){
                    db['lineOriginal'].push(getAreaOrLength(shape,selectedLayer));
                    db['line'].push(calculateAreaUsingPitch(getAreaOrLength(shape,selectedLayer),pitch));
                    db['lineTool'].push(shape);
                    db['lineLayer'].push(selectedLayer);
                    db['lineVisibility'].push(true);
                    db['linePitch'].push(pitch);
                } else if(MarkerTools.indexOf(shape) != -1 ) {
                    db['markerOriginal'].push(getAreaOrLength(shape,selectedLayer));
                    db['marker'].push(getAreaOrLength(shape,selectedLayer));
                    db['markerTool'].push(shape);
                    db['markerFor'].push(sub_tool);
                    db['markerLayer'].push(selectedLayer);
                    db['markerVisibility'].push(true);
                }else {
                    db['areaOriginal'].push(getAreaOrLength(shape,selectedLayer));
                    db['area'].push(calculateAreaUsingPitch(getAreaOrLength(shape,selectedLayer),pitch));
                    db['areaTool'].push(shape);
                    db['areaLayer'].push(selectedLayer);
                    db['areaVisibility'].push(true);
                    db['areaPitch'].push(pitch);
                    db['areaSegments'].push(getSegmentsOfArea(shape,selectedLayer));
                }
            }

            // Update Specific values of variable as the areas changed
            function updateOrigins2(shape, selectedLayer, pitch)
            {
                if(LineTools.indexOf(shape) != -1 ){
                    index = db.lineLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.lineOriginal[index] = getAreaOrLength(shape,selectedLayer);
                    db.line[index] = getAreaOrLength(shape,selectedLayer);
                    db.linePitch[index] = pitch;
                } else {
                    index = db.areaLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.area[index] = getAreaOrLength(shape,selectedLayer);
                    db.areaOriginal[index] = getAreaOrLength(shape,selectedLayer);
                    db.areaPitch[index] = pitch;
                }
            }

            // Delete Specific values of variable as the areas changed
            function removeOrigins(shape,selectedLayer)
            {
                $("#properties").hide();
                if(LineTools.indexOf(shape) != -1 ){
                    index = db.lineLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.line.splice(index,1);
                    db.lineOriginal.splice(index,1);
                    db.linePitch.splice(index,1);
                    db.lineTool.splice(index,1);
                    db.lineLayer.splice(index,1);
                    // db.line[index] = getAreaOrLength(shape,selectedLayer);
                } else if(MarkerTools.indexOf(shape) != -1 ){
                    index = db.markerLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.marker.splice(index,1);
                    db.markerOriginal.splice(index,1);
                    db.markerFor.splice(index,1);
                    db.markerTool.splice(index,1);
                    db.markerLayer.splice(index,1);
                    db.markerVisibility.splice(index,1);
                    // db.line[index] = getAreaOrLength(shape,selectedLayer);
                } else {
                    index = db.areaLayer.findIndex((v) => v._leaflet_id == selectedLayer._leaflet_id);
                    db.area.splice(index,1);
                    db.areaOriginal.splice(index,1);
                    db.areaPitch.splice(index,1);
                    db.areaTool.splice(index,1);
                    db.areaLayer.splice(index,1);
                    // db.area[index] = getAreaOrLength(shape,selectedLayer);
                }
            }

            function circleMarkers(feature, latlng) {
                let color = "#080142"
                if(feature.tool == "Storm-Damage"){
                        color = "red"
                    }
                return L.circleMarker(latlng, {
                    fillColor: feature.color,
                    color: color,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.2
                });
            }

            function shapeStyle(feature){
                if(LineTools.indexOf(feature.features[0].tool) == -1)
                {
                    return;
                }
                return {
                    // fillColor: 'blue',
                    color: feature.features[0].color,  //Outline color
                };
            }

            function onEachFeature(feature, layer) {
                if(!feature.tool) return;
                //bind click
                setOrigins2(feature.tool,layer,feature.pitch,feature.sub_tool);
                showTotalSelectedArea();

                // Edit Functionality
                layer.on('pm:edit', e => {
                    updateOrigins2(feature.tool,layer,pitch)
                    layer.on('mouseup mouseout',function(e) {
                        hoverEffectOnShapesDisable(layer._leaflet_id);
                    });
                    layer.on('mousedown',function(e) {
                        hoverEffectOnShapesEnable(layer._leaflet_id);
                    });
                    showTotalSelectedArea();
                    showPopUp('',layer._leaflet_id);
                });

                // Remove
                layer.on('pm:remove',function(e){
                    removeOrigins(feature.tool,layer)
                    showTotalSelectedArea();
                });

                layer.on('mouseup mouseout',function(e) {
                        hoverEffectOnShapesDisable(layer._leaflet_id);
                });
                layer.on('mousedown',function(e) {
                    hoverEffectOnShapesEnable(layer._leaflet_id);
                });

                layer.on('click', e => {
                    if(MarkerTools.indexOf(layer.feature.tool) != -1)
                    {
                        showDamagePopup(layer.feature.tool,layer._leaflet_id);
                    }
                    showTotalSelectedArea();
                    showPopUp('',layer._leaflet_id);
                });
            }

            // Add Shaped get From DB
            function addFeature(feature) {
                let isAvailable = true;

                var group = L.geoJson({
                    "type": "FeatureCollection",
                    "features": []
                }).addTo(map);

                let layer = L.geoJson(feature,{style : shapeStyle.bind(this,feature),onEachFeature: onEachFeature, pointToLayer: circleMarkers}).addTo(group);

                if(LineTools.indexOf(feature.features[0].tool) != -1){
                    layer.bringToFront();
                }
                return layer;
            }
            // Sleep function


            function showDamagePopup(type,leafletId)
            {
                $(".p2header").html('<b>'+type+'</b>');
                let opt = type == 'Vent' ? VentOptions : damageOptions;
                $("#damageOpt").html(opt.join(""));
                $("#damageLeafletId").val(leafletId);
                let {markerFor} = getDataByLeafletId(leafletId);
                $("#damageType").text(markerFor || '--');
                $("#damageOpt").val(markerFor || '').change();
                return $("#properties2").show();
            }

            // show Area to my Popup div
            function showPopUp(areas,leafletId){ //Render method for area info
                showTotalSelectedArea();
                leaflet_id_pitch = leafletId;
                var leafletId = leaflet_id_pitch;
                let {index, pitch, type, tool, area, visibility} = getDataByLeafletId(leafletId);
                if(area === undefined)
                {
                    return;
                }
                $('#title').html((tool.charAt(0).toUpperCase() + tool.slice(1)));
                $("#sidType").text(tool.charAt(0).toUpperCase() + tool.slice(1));

                $("#layerVisibility").find('.toggleEye').first().removeClass('fa-eye-slash fa-eye').addClass(visibility ? "fa-eye" : "fa-eye-slash");

                $("#properties").find("td[data-leaflet-id]").attr("data-leaflet-id",leaflet_id_pitch);

                $("#properties").find("td[data-leaflet-id]").text(type == "line" ? "Length" : type.charAt(0).toUpperCase() + type.slice(1));

                if(LineTools.indexOf(tool) != -1)
                {
                    $("#newLayerValue").parents().closest('tr').hide()
                } else {
                    $("#newLayerValue").parents().closest('tr').show()
                }

                if(area){

                    let p = pitch != undefined ? pitch : $("#globalPitch").val();

                    $('#newPitchValue').val(p).change();
                    if(type == 'line')
                    {
                        $("#sidLength").text(getFeetInchesLine(area));
                    } else {
                        $("#sidLength").text(calulateArea(area));
                    }
                    return $("#properties").show();
                }
                $("#properties").hide();
            }


            function hideWasteData(){
                $("#wasteTool").hide();
            }
            // Hide popup div
            function hideItemData() {
                $("#properties").hide();
                $("#properties2").hide();
            }

            // printable area value
            function calulateArea(arg) {
                res = getTotalArea(arg);
                return getFeetInches(res);
            }

            function getFeetInches(f2) {
                
                return (Math.round(f2*100) /100) + "'";
            }

            function getFeetInchesLine(m) {
                ftFloat = m * 3.28084;
                tempFeet = Math.floor(ftFloat);
                tempInch = Math.round((ftFloat - tempFeet) * 12);
                return tempFeet + "' " + tempInch + "''";
            }

            // calculatable area value
            function getTotalArea(arg){
                res = arg * 10.7639;
                return res;
            }

             // calculatable line value
             function getTotalLine(arg){
                res = arg * 3.28084;
                return res;
            }

            // Toggle between Street View and Satelite view
            $(".setMapToggle").on('click',function(){
                $(".setMapToggle > i").toggleClass('fa-street-view fa-map');
                $(".setMapToggle").attr('title','Pitch Tool')
                panorama.setVisible(false)
                if($(".setMapToggle > i").hasClass('fa-map'))
                {
                    $("#gauge").show();
                    $(".setMapToggle").attr('title','Satellite View')
                    panorama.setVisible(true)
                } else {
                    $("#gauge").hide();
                    map.panTo([lat, lng ], 20)
                }
            });
            var set_gauge_position_to_middle = false;
            // Move Pitch Gauge with Mouse
            function streetMouseMove(event) {
                mouseXstreet = event.clientX;
                mouseYstreet = event.clientY;
                if(mouseXstreet > 85 && mouseXstreet){
                var b = document.getElementById('gauge');
                    // b.style.left = (mouseXstreet - 30) + 'px';
                    // b.style.top = (mouseYstreet - 300) + 'px';
                    if(set_gauge_position_to_middle)
                    {
                        b.style.left = (mouseXstreet - 30) + 'px';
                        b.style.top = (mouseYstreet - 300) + 'px';
                    }
                    else{
                        b.style.left = (mouseXstreet - 120) + 'px';
                        b.style.top = (mouseYstreet - 508) + 'px';
                    }

                }
            }

            $(document).on("keydown", function (event) {
                if (event.ctrlKey  &&  event.altKey ) {  // case sensitive
                    $('.pitch-gauge-position').html('<b>Pitch Gauge Handler</b> - Middle (ctrl+alt)');
                    set_gauge_position_to_middle = true;
                }
            });

            $(document).on("keyup", function (event) {
                if (event.key == 'Alt') {  // case sensitive
                    $('.pitch-gauge-position').html('<b>Pitch Gauge Handler</b> - Bottom (ctrl+alt)');
                    set_gauge_position_to_middle = false;
                }
            });

            $("body").on("change","#wasteOpt",function(){
                waste = $(this).val();
            })
            // Trigger when pitch changes
            $("#newPitchValue").on("change",function(){
                var leafletId = leaflet_id_pitch;
                let {index, areaOriginal, type} = getDataByLeafletId(leafletId);
                let oldArea = areaOriginal;
                let newPitchValue = $("#newPitchValue").val();
                newPitchValue = Number.isNaN(newPitchValue) ? 0 : Number(newPitchValue);
                let res = calculateAreaUsingPitch(oldArea,newPitchValue);
                if(type=='line') {
                    db.line[index] = res;
                    db.linePitch[index] = newPitchValue;
                    $("#sidLength").text(getFeetInchesLine(res));
                    
                } else {
                    db.area[index] = res;
                    db.areaPitch[index] = newPitchValue;
                    $("#sidLength").text(calulateArea(res));
                }
                showTotalSelectedArea();
            });
            $("#globalPitch").on("change",function(){
                db['global_pitch'] = $(this).val();


            });

            function updatePitch(leafletId, oldArea, pitch) {
                let {index, areaOriginal, type} = getDataByLeafletId(leafletId);
                newPitchValue = Number.isNaN(Number(pitch)) ? 0 : Number(pitch);
                $("#newPitchValue").val(newPitchValue).change();
                let res = calculateAreaUsingPitch(oldArea,newPitchValue);
                if(type=='line') {
                    db.line[index] = res;
                    db.linePitch[index] = newPitchValue;
                } else {
                    db.area[index] = res;
                    db.areaPitch[index] = newPitchValue;
                }
                $("#sidLength").text(calulateArea(res));
            }

            // Trigger when Stories changes
            $("#newStoriesValue").on("change",function(){
                var leafletId = leaflet_id_pitch;
                let {index} = getDataByLeafletId(leafletId);
                let newStories = $("#newStoriesValue").val();
                newStories = Number.isNaN(newStories) ? 0 : Number(newStories);
                db.areaStories[index] = newStories;
            });


            // Trigger when Stories changes
            $("#damageOpt").on("change",function(event){
                let val = event.target.value;
                let leafletId = $("#damageLeafletId").val();
                let {index} = getDataByLeafletId(leafletId);
                $("#damageType").text(event.target.value || '--');
                if(val){
                    db.markerFor[index] = val;
                }
            });


            //calculate areas by pitch
            function calculateAreaUsingPitch(area, pitch) {
                resArea = 0;
                pitch = pitch / 12;
                pitch = pitch * pitch;
                pitch = pitch + 1;
                pitch = Math.sqrt(pitch);
                resArea = area * pitch;
                return resArea;
            }
            function compressArray(original) {
                var compressed = [];
                // make a copy of the input array
                var copy = original.slice(0);
                // first loop goes over every element
                for (var i = 0; i < original.length; i++) {
                    var myCount = 0;
                    // loop over every element in the copy and see if it's the same
                    for (var w = 0; w < copy.length; w++) {
                        if (original[i] == copy[w]) {
                            // increase amount of times duplicate is found
                            myCount++;
                            // sets item to undefined
                            delete copy[w];
                        }
                    }
                    if (myCount > 0) {
                        var a = new Object();
                        a.value = original[i];
                        a.count = myCount;
                        compressed.push(a);
                    }
                }
                return compressed;
            };
            // Function to show all selected areas total
            function showTotalSelectedArea(){

                let totalArea = db.area.length > 0
                    ? db.area.reduce((a,b)=> parseFloat(a)+parseFloat(b),0)
                    : '--';
                    
                let totalLine = db.line.length > 0
                    ? db.line.reduce((a,b)=> parseFloat(a)+parseFloat(b),0)
                    : '--';

                let row = [];

                let header1 = '<tr class="bg-dark text-white"><td>#</td><td>Areas</td><td>Pitch</td><td>Tool</td><td></td></tr>';
                let header2 = '<tr class="bg-dark text-white"><td>#</td><td>Length</td><td>Pitch</td><td>Tool</td><td></td></tr>';
                let header3 = '<tr class="bg-dark text-white"><td>#</td><td colspan="2">Type</td><td colspan="2">Count</td></tr>';

                row = db.area.map((a,index) => {
                let sr = index + 1;
                if(index > 0){header1 = ''}
                return header1+"<tr class='a_row'><td data-leaflet-id='"+db.areaLayer[index]._leaflet_id+"'>"+ sr +"</td><td class='measures_data' style='cursor:pointer' title='Show Info'>"+ calulateArea(a) +"</td><td>"+ (db.areaPitch[index] != undefined ? db.areaPitch[index] : '--') +"</td><td>"+ (db.areaTool[index] != undefined ? db.areaTool[index].charAt(0).toUpperCase() + db.areaTool[index].slice(1) : '--') +"</td><td class='toggleEye' style='cursor:pointer' ><i class='fas "+ (db.areaVisibility[index] ? 'fa-eye' : 'fa-eye-slash') +" toggleEye' ></i></td></tr>";
                });

                if(db.area.length > 0){
                    row.push("<tr class='text_bold'><td colspan=2>Total Area</td><td colspan=3>"+ calulateArea(totalArea) +"</td></tr>");
                }

                if(db.line.length > 0 && db.area.length > 0){
                    row.push("<tr><td height=10 colspan=4></td></tr>");
                }


                // Get Unique Tools
                tools = [...new Set(db.lineTool)];
                
                //Sort based on tools

                tools.forEach((tool,index)=>{
                    var arr = 0;
                    var i = 1;
                    row.push('<tr class="bg-dark text-white"><td>#</td><td>Length</td><td>Pitch</td><td>Tool</td><td></td></tr>');
                    row.push(db.lineTool.map((a,index) => {
                        let sr = i;
                        if(index > 0){header2 = ''}
                        if(a == tool){
                            arr += db.line[index];
                            i++;
                            return "<tr class='a_row'><td data-leaflet-id='"+db.lineLayer[index]._leaflet_id+"'>"+ sr +"</td><td class='measures_data' style='cursor:pointer' title='Show Info'>"+ getFeetInchesLine(db.line[index]) +"</td><td>"+ (db.linePitch[index] != undefined ? db.linePitch[index] : '--') +"</td><td>"+ (db.lineTool[index] != undefined ? db.lineTool[index].charAt(0).toUpperCase() + db.lineTool[index].slice(1) : '--') +"</td><td class='toggleEye' style='cursor:pointer' ><i class='fas "+ (db.lineVisibility[index] ? 'fa-eye' : 'fa-eye-slash') +" toggleEye' ></i></td></tr>";

                        }

                    }));
                    
                    row.push("<tr class='text_bold'><td colspan=2>Total "+tool+"</td><td colspan=3>"+ getFeetInchesLine(arr) +"</td></tr>"+header2+"");

                });

               var markerFor = compressArray(db.markerFor); //  find duplicate in array and count
                row.push(markerFor.map((a,index) => {
                    let sr = index + 1;
                    if(index > 0){header3 = ''}
                    return header3+"<tr class='a_row'><td data-leaflet-id=''>"+sr+"</td><td class='measures_data' style='cursor:pointer' title='Show Info' colspan='2'>"+ markerFor[index]['value']+"</td><td colspan='2'>"+markerFor[index]['count']+"</td></tr>";
                   }));


                if(db.line.length > 0){
                    //row.push("<tr><td colspan=2>Total Lines</td><td colspan=3>"+ getFeetInchesLine(totalLine) +"</td></tr>");
                }

                // If Object is null show default -- table row
                if(db.line.length + db.area.length == 0){
                    row.push("<tr><td>--</td><td>--</td><td>--</td><td>--</td></tr>");
                }
                $(".total_area_value").html(row);
                // Scroll to bottom
            }


            //Get data from DB Variable
            function getDataByLeafletId(leafletId){
                let index = '', type = '', pitch = '', tool = '',area = 0,areaOriginal = 0, layer,markerFor ='', visibility = true;
                if(db.lineLayer.findIndex((v) => v._leaflet_id == leafletId) != -1 )
                {
                    index = db.lineLayer.findIndex((v) => v._leaflet_id == leafletId);
                    pitch = db.linePitch[index];
                    tool = db.lineTool[index];
                    area = db.line[index];
                    layer = db.lineLayer[index];
                    areaOriginal = db.lineOriginal[index];
                    visibility = db.lineVisibility[index];
                    type =  'line';
                }else if(db.markerLayer.findIndex((v) => v._leaflet_id == leafletId) != -1 )
                {
                    index = db.markerLayer.findIndex((v) => v._leaflet_id == leafletId);
                    markerFor = db.markerFor[index];
                    tool = db.markerTool[index];
                    layer = db.markerLayer[index];
                    visibility = db.markerVisibility[index];
                    type =  'damage';
                } else {
                    index = db.areaLayer.findIndex((v) => v._leaflet_id == leafletId);
                    pitch = db.areaPitch[index];
                    tool = db.areaTool[index];
                    area = db.area[index];
                    layer = db.areaLayer[index];
                    areaOriginal = db.areaOriginal[index];
                    visibility = db.areaVisibility[index];
                    type = 'area';

                }
                return { index, type, pitch, tool, area, areaOriginal, layer, visibility,markerFor }
            }

            // Hilight Hover color
            function hoverEffectOnShapesEnable(leafletId) {
                let {layer, type, area} = getDataByLeafletId(leafletId);
                if(area === undefined) { return;}
                path = layer._path;
                if(type != 'line') {
                $(path).attr('fill',hoverColor);
                } else {
                $(path).attr('stroke-width',hoverWidth);
                }
                $("[data-leaflet-id = "+leafletId+"]").closest('tr').css('background',"#ff810045");
            }

            function hoverEffectOnShapesDisable(leafletId) {
                let {layer, type, area} = getDataByLeafletId(leafletId);
                if(area === undefined) { return;}
                path = layer._path;
                if(type != 'line') {
                $(path).attr('fill',oldPathColor);
                } else {
                $(path).attr('stroke-width',oldPathWidth);
                }
                $("[data-leaflet-id = "+leafletId+"]").closest('tr').css('background','');
            }

            function toggleShape(leafletId){
                let {layer, type, index, visibility} = getDataByLeafletId(leafletId);
                if(type != 'line') {
                    db.areaVisibility[index] = !visibility;
                } else {
                    db.lineVisibility[index] = !visibility;
                }
                
                if(visibility){
                    layer.remove()
                } else {
                    layer.addTo(this.map)
                }
                
                showTotalSelectedArea();
            }

            // ===============================Misc function=============================

            $(function() {

                $( ".draggable" ).draggable({containment: 'document'});
                $('.setPitch').hide();

                //========================================================
                // Hover Effects
                $(".total_area_value").on('mouseover',function(e){
                    if(e.target.parentElement != undefined ) {
                        let row = e.target.parentElement;
                        td = $(row).find('td:first-child');
                        id = Number(td.attr('data-leaflet-id')); // Check if row exist
                        if(!Number.isNaN(id)) {
                            hoverEffectOnShapesEnable(id);
                        }
                    }
                });

                $(".total_area_value").on('mouseout',function(e){
                    if(e.target.parentElement != undefined ) {
                        let row = e.target.parentElement;
                        td = $(row).find('td:first-child');
                        id = Number(td.attr('data-leaflet-id')); // Check if row exist
                        if(!Number.isNaN(id)) {
                            hoverEffectOnShapesDisable(id);
                        }
                    }
                });
                //==========================================================

                $(".total_area_value").on('click',function(e){
                    if(e.target.parentElement != undefined ) {
                        let row = $(e.target).closest('tr');
                        td = $(row).find('td:first-child');
                        id = Number(td.attr('data-leaflet-id')); // Check if row exist
                        if(!Number.isNaN(id) && $(e.target).hasClass('toggleEye'))
                        {
                            $(e.target).toggleClass($(e.target).hasClass('fa-eye-slash') ? 'fa-eye' : 'fa-eye-slash' )
                            toggleShape(id);
                            $("#layerVisibility").find('.toggleEye').first().removeClass('fa-eye-slash fa-eye').addClass(getDataByLeafletId(id).visibility ? "fa-eye" : "fa-eye-slash");
                        }
                        if(!Number.isNaN(id) && $(e.target).hasClass('measures_data')) {
                            showPopUp("",id);
                        }
                    }
                });

                // Function for the properties area Dialog box
                $("#properties .toggleEye").on('click',function(e){
                        let row = $(e.target).closest('tr');
                        td = $(row).find('td:first-child');
                        id = Number(td.attr('data-leaflet-id')); // Check if row exist
                        if(!Number.isNaN(id) && $(e.target).hasClass('toggleEye'))
                        {
                            toggleShape(id);
                            showPopUp("",id);
                        }
                });

            });

        //==============================================Recreate Shapes from DB===================
        function recreateMap() {
                var newstuff = newJSON;
                var newAreas=[];
                newstuff.areas.forEach(area => {
                    
                    var path = [];
                    area.points.forEach(p => {
                        path.push([p.longitude,p.latitude]);//this fixes the backwards long/lat
                    });
                    
                    var feature = {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "properties": {},
                            "tool"     : 'Polygon',
                            "color"    : 'red',
                            "pitch"    : area.pitch,
                            "layer"    : area.layer,
                            "stories"  : area.stories,
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [path]
                            }
                        }]
                    }
                    addFeature(feature)
                });

            if (linesDB != "") {
                //translate line object to old array
               
                //translate to unnamed array
                var newlines=[];
                newstuff.lines.forEach(line => {
                    
                    var newline=[];
                    var $i=0;
                    line.points.forEach( p =>{
                        newline[$i]=p.latitude;
                        newline[$i+1]=p.longitude;
                        $i=$i+2;
                    });
                    newline[$i]=line.lineLength;
                    newline[++$i]=line.lineTool;            
                    newline[++$i]="";   
                    newline[++$i]=line.linePitch;   
                    newline[++$i]=""; 

                    newlines.push(newline);
            });
            
            linesHlp=newlines;                

                //linesHlp_old = JSON.parse(linesDB);
                linesHlp_old = linesDB;
                for (k = 0; k < linesHlp.length; k++) {

                var path = [];

                let temp = 0;
                for (j = 0; j < (linesHlp[k].length - 5) / 2; j++) {
                    path.push([linesHlp[k][j+1+temp],linesHlp[k][j+temp]]);
                    temp++;
                }
                console.log(path);
                var feature = {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "properties": {},
                        "color": getColor(linesHlp[k][(linesHlp[k].length - 5)+1]),
                        "tool"      : linesHlp[k][(linesHlp[k].length - 5)+1],
                        "size"    : linesHlp[k][(linesHlp[k].length - 5)],
                        "pitch"    : linesHlp[k][(linesHlp[k].length - 5)+3],
                        "geometry": {
                            "type": "LineString",
                            "coordinates": path
                        }
                    }]
                }
                addFeature(feature)
            }
            }

            if (markersDB != "") {
                
                //translate to unnamed array
                var newmarks=[];
                newstuff.markers.forEach(marker => {
                    var mark=[];
                    mark[0]=marker.latitude;
                    mark[1]=marker.longitude;
                    mark[2]=marker.name;
                    mark[3]=marker.type;
                    newmarks.push(mark);
                });
markersHlp = newmarks;
                for (k = 0; k < markersHlp.length; k++) {


                path = [markersHlp[k][1],markersHlp[k][0]];

                var feature = {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "properties": {
                            "shape": "CircleMarker",
                            "name": "Unnamed Layer",
                            "category": "default",
                            "radius" : 10,
                        },
                        "color": getColor(markersHlp[k][3]),
                        "tool"    : markersHlp[k][3],
                        "sub_tool"   : markersHlp[k][2],
                        "geometry": {
                            "type": "Point",
                            "coordinates": path
                        }
                    }]
                }
                addFeature(feature);
            }
            }

        }


        function getColor(tool){
            let color = "black";
            switch(tool) {
                case 'Ridge' :
                color = 'red';
                break;
                case 'Hip' :
                color = 'orange';
                break;
                case 'Rake' :
                color = 'green';
                break;
                case 'Valley' :
                color = 'blue';
                break;
                case 'Eave' :
                color = 'purple';
                break;
                case 'Circle' :
                color = 'black';
                break;
                case 'Step-flashing' :
                color = 'teal';
                break;
                case 'Base-flashing' :
                color = 'black';
                break;
                case 'Vent' :
                color = '#080142';
                break;
                case 'Storm-Damage' :
                color = '#080142';
                break;

                //damage type
                case 'Leak Area' :
                color = 'red';
                break;
                case 'Hail Damage' :
                color = 'orange';
                break;
                case 'Wind Damage' :
                color = 'yellow';
                break;
                case 'Shingle Defect' :
                color = 'pink';
                break;
                //end damage type

                //Vent type
                case 'Box Vent' :
                color = 'green';
                break;
                case 'Chimney Cricket' :
                color = 'red';
                break;
                case 'Power Fan' :
                color = 'orange';
                break;
                case 'pipe boot 2 inch' :
                color = 'yellow';
                break;
                case 'pipe boot 3 inch' :
                color = 'blue';
                break;
                case 'pipe boot 4 inch' :
                color = 'SEAGREEN';
                break;
                case 'Turbine Vent' :
                color = 'TEAL';
                //end Vent type

                break;
                // case 'Polygon' :
                // color
                // break;
                // case 'Polygon' :
                // color
                // break;
            }
            return color;
        }

        //===================================PDF & Save=============================================//


        //*********calculating the total amounts

        function updateArea() {
            console.log("update area")
            totalAreaPdf = 0;
            totalTwoStories = 0;
            numberOfTwoStories = 0;

            totalLowPitch = 0;
            totalSteep89 = 0;
            totalSteep10 = 0;
            totalPitch3 = 0;


            numberOfLow = 0;
            numberOfSteep89 = 0;
            numberOfSteep10 = 0;
            numberOfPitch3 = 0;


            for (i = 0; i < db.areaLayer.length; i++) {
                // if (areas[i].deleted == 0) {
                    if (db.areaPitch[i] < 25 || db.areaPitch[i] == undefined ) {
                        totalAreaPdf += Number(db.area[i]);
                    }
                    if (db.areaStories[i] == 2) {
                        totalTwoStories += Number(db.area[i]);
                        numberOfTwoStories++;
                    }
                    if (db.areaPitch[i] < 3) {
                        totalLowPitch += Number(db.area[i]);
                        numberOfLow++;
                    }
                    if ((db.areaPitch[i] > 9) && (db.areaPitch[i] < 25)) {
                        totalSteep10 += Number(db.area[i]);
                        numberOfSteep10++;
                    }
                    if ((db.areaPitch[i] == 8) || (db.areaPitch[i] == 9)) {
                        totalSteep89 += Number(db.area[i]);
                        numberOfSteep89++;
                    }
                    if (db.areaPitch[i] == 3) {
                        totalPitch3 += Number(db.area[i]);
                        numberOfPitch3++;
                    }



            }

            totalAreaPdf += (totalAreaPdf / 100) * waste;
            totalTwoStories += (totalTwoStories / 100) * waste;
            totalLowPitch += (totalLowPitch / 100) * waste;
            totalSteep89 += (totalSteep89 / 100) * waste;
            totalSteep10 += (totalSteep10 / 100) * waste;
            totalPitch3 += (totalPitch3 / 100) * waste;

        }


        function updateLine() {
            totalRidge = 0;
            totalHip = 0;
            totalRake = 0;
            totalEave = 0;
            totalValley = 0;
            totalPitchChange = 0;
            totalStepFlashing = 0;
            totalBaseFlashing = 0;
            totalVent = 0;

            numberOfRidges = 0;
            numberOfHips = 0;
            numberOfRakes = 0;
            numberOfEaves = 0;
            numberOfValleys = 0;
            numberOfPitchChanges = 0;
            numberOfStepFlashings = 0;
            numberOfBaseFlashings = 0;
            numberOfVents = 0;




            for (i = 0; i < db.lineLayer.length; i++) {

                // if (lines[i].deleted == 0) {
                    if (db.lineTool[i] == 'Ridge') {
                        totalRidge += Number(db.line[i]);
                        numberOfRidges++;
                    }
                    if (db.lineTool[i] == 'Hip') {
                        totalHip += Number(db.line[i]);
                        numberOfHips++;
                    }
                    if (db.lineTool[i] == 'Rake') {
                        totalRake += Number(db.line[i]);
                        numberOfRakes++;
                    }
                    if (db.lineTool[i] == 'Eave') {
                        totalEave += Number(db.line[i]);
                        numberOfEaves++;
                    }
                    if (db.lineTool[i] == 'Valley') {
                        totalValley += Number(db.line[i]);
                        numberOfValleys++;
                    }
                    if (db.lineTool[i] == 'Step-flashing') {
                        totalStepFlashing += Number(db.line[i]);
                        numberOfStepFlashings++;
                    }
                    if (db.lineTool[i] == 'Base-flashing') {
                        totalBaseFlashing += Number(db.line[i]);
                        numberOfBaseFlashings++;
                    }
                    if (db.lineTool[i] == 'Vent') {
                        totalVent += Number(db.line[i]);
                        numberOfVents++;
                    }
                    if (db.linePitch[i] != undefined) {
                        totalPitchChange += Number(db.line[i]);
                        numberOfPitchChanges++;
                    }


                // }
            }
            totalRidge += (totalRidge / 100) * waste;
            totalHip += (totalHip / 100) * waste;
            totalRake += (totalRake / 100) * waste;
            totalEave += (totalEave / 100) * waste;
            totalValley += (totalValley / 100) * waste;
            totalPitchChange += (totalPitchChange / 100) * waste;
            totalStepFlashing += (totalStepFlashing / 100) * waste;
            totalBaseFlashing += (totalBaseFlashing / 100) * waste;
            totalVent += (totalVent / 100) * waste;

        }

        // Data to save into DB
        function getCoordinates(onlydrawings) {
            let measurements = [];
            manualedited=onlydrawings;
            document.getElementById('loader').style.display='block';
            var areasPacked = [];
            var linesPacked = [];
            var markersPacked = [];
            var mapPacked = [];           
            var areaJSON = [];         

            for (j = 0; j < db.areaLayer.length; j++) {
                    var arr = [];
                    var hlp = [];

                    var areaObject = {
                    points:[],
                    area:0,
                    
                    pitch:0,
                    stories:0             

                };
                
                    for (i = 0; i < db.areaLayer[j]._latlngs[0].length; i++) {
                        let p={};
                        p.latitude = db.areaLayer[j]._latlngs[0][i].lat;
                        p.longitude =db.areaLayer[j]._latlngs[0][i].lng;
                        areaObject.points.push(p);
                    }
                    
                    arr.push(hlp);
                    var area=db.area[j];
                    areaObject.area=area;
                    arr.push(area);
                    areaObject.pitch=db.areaPitch[j];
                    arr.push('');
                    arr.push('');
                    arr.push(db.areaPitch[j]);
                    arr.push(5);
                    arr.push(db.areaStories[j]);

                    //areasPacked.push(arr);
                    areaJSON.push(areaObject);
                    let m={...areaObject};
                    m.UOM="m2";
                    delete m.area;
                    m.total=areaObject.area;
                    m.type="area";
                    m.materialType ="cover"
                    m.pitch = db.areaPitch[j];
                    measurements.push(m);
            }
            

            var ridge=parseFloat("0");
            var eave=parseFloat("0");
            var hip=parseFloat("0");
            var valley=parseFloat("0");
            var rake=parseFloat("0");
            //****************** LINES *************************
            var lineJSON = [];

            for (j = 0; j < db.lineLayer.length; j++) {
                var newLine = {
                    lineTool:db.lineTool[j],
                    linePitch:db.linePitch[j],
                    lineLength:db.line[j],             
                    points:[]
                };
                
               
                for(i=0;i<(db.lineLayer[j]._latlngs.length);i++)
                {
                    let p={};
                    p.latitude=db.lineLayer[j]._latlngs[i].lat;
                    p.longitude=db.lineLayer[j]._latlngs[i].lng;
                    newLine.points.push(p);
                }
                
                lineJSON.push(newLine);
                let l={...newLine};
                l.UOM="m";
                l.type="line";
                l.pitch = db.linePitch[j];
                l.materialType=db.lineTool[j].toLowerCase().replaceAll(" ","-");
                delete l.lineTool;
                delete l.linePitch;
                delete l.lineLength;
                l.total=newLine.lineLength;
                
                measurements.push(l);
                    var arr = [];
                    for(k = 0; k < db.lineLayer[j]._latlngs.length ; k++) { //Working Version
                        arr.push(db.lineLayer[j]._latlngs[k].lat);
                        arr.push(db.lineLayer[j]._latlngs[k].lng);
                    }
                    var lineTool=db.lineTool[j];
                    var lineLength=db.line[j];
                    switch(lineTool)
                    {//add up liness to for total
                        case 'Ridge':
                        ridge=ridge+parseFloat(lineLength);
                        break;
                        case 'Eave':
                        eave=eave+parseFloat(lineLength);
                        break;
                        case 'Hip':
                        hip=hip+parseFloat(lineLength);
                        break;
                        case 'Valley':
                        valley=valley+parseFloat(lineLength);
                        break;
                        case 'Rake':
                        rake=rake+parseFloat(lineLength);
                        break;
                    }
                    arr.push(db.line[j]);
                    arr.push(lineTool);
                    arr.push('');
                    arr.push(db.linePitch[j]);
                    arr.push('');
                    linesPacked.push(arr);

            }
            
            //****************** Markers *************************
            var markerJSON = [];           

            for (j = 0; j < db.markerLayer.length; j++) {
                var markerObject = {
                    
                    latitude:db.markerLayer[j]._latlng.lat,
                    longitude:db.markerLayer[j]._latlng.lng,
                    type:db.markerTool[j],
                    name:db.markerFor[j]
                };
                markerJSON.push(markerObject);
                let mark={ points:[]};
                mark.points.push({latitude:db.markerLayer[j]._latlng.lat, longitude:db.markerLayer[j]._latlng.lng})
                mark.UOM="ea";
                mark.type ="point";
                mark.materialType=undefined;
                if(markerObject.name)                    
                mark.materialType=markerObject.name.replaceAll(" ","-").toLowerCase();
               
                mark.total = mark.points.length
                measurements.push(mark);
            }


            var areasData = areasPacked; //removed json encode
            var linesData = linesPacked;//removed json encode
            //var markersData = JSON.stringify(markersPacked);

            latitude = map.getCenter().lat;
            longitude = map.getCenter().lng;
            mapPacked.push(latitude);
            mapPacked.push(longitude);
            pitch = $('#globalPitch').val();

            let tA = db.area.length > 0
                    ? db.area.reduce((a,b)=> parseFloat(a)+parseFloat(b),0)
                    : '--';
                    let totalArea=getTotalArea(tA);
            
            let projectId=dbProject._id
            let pipe3 = measurements.filter((m) => m.materialType ==="pipe-boot-3-inch").length;
            let pipe4 = measurements.filter((m) => m.materialType ==="pipe-boot-4-inch").length;
            let boxvent = measurements.filter((m) => m.materialType ==="box-vent").length;
            let steeparea = measurements.filter((m) => m.materialType ==="cover" && m.pitch>2).reduce((accumulator, object) => { return accumulator + object.total; }, 0);
            let flatarea = measurements.filter((m) => m.materialType ==="cover" &&  m.pitch<3).reduce((accumulator, object) => { return accumulator + object.total; }, 0);

            let jsonProjectData= {
                ...dbProject,
                measurement: {
                    calculated_values:[
                        { name:"cover", uom:"m2", total:flatarea, overriddenTotal:null, pitch:0},
                        { name:"cover", uom:"m2", total:steeparea, overriddenTotal:null, pitch:3},
                        { name:"hip", uom:"m", total:hip, overriddenTotal:null },
                        { name:"eave", uom:"m", total:eave, overriddenTotal:null },
                        { name:"ridge", uom:"m", total:ridge, overriddenTotal:null},
                        { name:"rake", uom:"m" , total:rake, overriddenTotal:null},
                        { name:"valley", uom:"m" , total:valley, overriddenTotal:null},
                        { name:"pipe-boot-3-inch", uom:"ea" ,total:pipe3, overriddenTotal:null},
                        { name:"pipe-boot-4-inch", uom:"ea" ,total:pipe4, overriddenTotal:null},
                        { name:"box-vent", uom:"ea" ,total:boxvent, overriddenTotal:null},
                    ],
                    
                    areas: areasData,
                    latitude: latitude,
                    longitude: longitude,
                    lines: linesData,
                    waste: waste,
                    pitch: pitch,
                    area: totalArea,
                    markers: [], 
                    ridge: (ridge *3.28084), //convert meters to feet
                    eave:(eave *3.28084),
                    hip: (hip*3.28084),
                    valley:(valley*3.28084),
                    rake:(rake*3.28084),
                    area: totalArea,
                    toolJSON:{
                        areas:areaJSON,
                        lines:lineJSON,
                        markers:markerJSON
                    },
                    measurements:measurements,
                    onlydrawings:onlydrawings
                }
            }
            
            $.ajax({
                url: '/api/projects/' + projectId,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(jsonProjectData),
                success: function(data) {
                    $("#lmsg").text("This estimate is successfuly saved!");
                    changesSaved = 1;
                  //  newJSON=JSON.stringify({
                    //    areas:areaJSON,
                    //    lines:lineJSON,
                   //     markers:markerJSON
                  //  });
                //    console.log(data);
                //     areasDB = JSON.stringify(areaJSON);
               //  console.log(linesDB);
              //   console.log(JSON.stringify(linesPacked));
           //  linesDB = JSON.stringify(linesPacked);
            // markersDB = markerJSON;
           /*  db = {
                        areaOriginal :[],
                        area :[],
                        areaTool:[],
                        areaStories : [],
                        areaPitch:[],
                        areaLayer : [],
                        areaVisibility : [],
                        areaOriginal :[],
                        areaSegments : [],
                        line:[],
                        lineTool:[],
                        linePitch:[],
                        lineLayer:[],
                        lineVisibility : [],
                        lineOriginal:[],
                        marker :[],
                        markerTool:[],
                        markerFor:[],
                        markerLayer : [],
                        markerVisibility : [],
                        markerOriginal:[],
                    };
                    init = true;
                    init = true;*/
                   // db.lineLayer=linespacked;
                    console.log(linesPacked);
                    //recreateMap();
                                        
                   
let canvass=`   <canvas id="generalCanvas" width= "600" height="800" style="border:1px solid #d3d3d3;"></canvas>
<canvas id="linesCanvas" width= "600" height="800" style="border:1px solid #d3d3d3;"></canvas>
            <canvas id="areasCanvas" width= "600" height="800" style="border:1px solid #d3d3d3;"></canvas>
            <canvas id="pitchCanvas" width= "600" height="800" style="border:1px solid #d3d3d3;"></canvas>
            <canvas id="ventCanvas" width= "600" height="800" style="border:1px solid #d3d3d3;"></canvas>
            <canvas id="stormCanvas" width= "600" height="800" style="border:1px solid #d3d3d3;"></canvas>`;
            document.getElementById('canvas-div').innerHTML="";
            document.getElementById('canvas-div').innerHTML=canvass;
            generatePdf(); //temporary

                },
                error : function(error){
                    document.getElementById('loader').style.display='none'
                }
            });
            console.log(db.lineLayer)
        }

        var scriptsLoaded = 0;
        var globle_var = [];
        var rad = function(x) {
            return x * Math.PI / 180;
        };

        var getDistance = function(p1, p2) {
            var R = 6378137; // Earth's mean radius in meter
            var dLat = rad(p2.lat() - p1.lat());
            var dLong = rad(p2.lng() - p1.lng());
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d; // returns the distance in meter
        };

        //this function calculates the text rotation
        function textDirection(x1, y1, x2, y2) {
            if (x1 < x2) {
                res = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            } else {
                res = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI;
            }


            if (res > 180) {
                res -= 180;
            }

            return res;
        }

        function generatePdf() {

            console.log("hello",db.lineLayer);
            var lines = [];

            topLeftX = 0;
            topLeftY = 0;

            //first approx - 42.5 pixels  = 1 m
            meterPixelConst = 42.5;

            maxCanvasWidth = 0;
            maxCanvasHeight = 0;

            for (j = 0; j < db.lineLayer.length; j++) {
                // if (db.areaLayer[j].deleted == 0) {
                    for (i = 0; i < db.lineLayer[j]._latlngs.length; i++) {
                        if (db.lineLayer[j]._latlngs[i].lat > topLeftY) {
                            topLeftY = db.lineLayer[j]._latlngs[i].lat;
                        }
                        if (db.lineLayer[j]._latlngs[i].lng < topLeftX) {
                            topLeftX = db.lineLayer[j]._latlngs[i].lng
                        }

                    }
                // }
            }

            // Markers
            for (j = 0; j < db.markerLayer.length; j++) {
                // if (db.areaLayer[j].deleted == 0) {
                        if (db.markerLayer[j]._latlng.lat > topLeftY) {
                            topLeftY = db.markerLayer[j]._latlng.lat;
                        }
                        if (db.markerLayer[j]._latlng.lng < topLeftX) {
                            topLeftX = db.markerLayer[j]._latlng.lng
                        }

                // }
            }

            //if no lines check for the areas
            for (j = 0; j < db.areaLayer.length; j++) {
                // if (db.areaLayer[j].deleted == 0) {
                    for (i = 0; i < db.areaLayer[j]._latlngs[0].length; i++) {
                        if (db.areaLayer[j]._latlngs[0][i].lat > topLeftY) {
                            topLeftY = db.areaLayer[j]._latlngs[0][i].lat;
                        }
                        if (db.areaLayer[j]._latlngs[0][i].lng < topLeftX) {
                            topLeftX = db.areaLayer[j]._latlngs[0][i].lng
                        }

                    }
                // }
            }



            for (i = 0; i < db.lineLayer.length; i++) {
                
                    for (j = 0; j < db.lineLayer[i]._latlngs.length - 1; j++) {
                        
                        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                        offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                        offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                        if (offsetX1 > maxCanvasWidth) {
                            maxCanvasWidth = offsetX1;
                        }
                        if (offsetX2 > maxCanvasWidth) {
                            maxCanvasWidth = offsetX2;
                        }
                        if (offsetY1 > maxCanvasHeight) {
                            maxCanvasHeight = offsetY1;
                        }
                        if (offsetY2 > maxCanvasHeight) {
                            maxCanvasHeight = offsetY2;
                        }
                    }
            }

            //if no lines then check the areas
            for (j = 0; j < db.areaLayer.length; j++) {
                // if (areas[j].deleted == 0) {
                    for (i = 0; i < db.areaLayer[j]._latlngs[0].length - 1; i++) {

                        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i + 1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                        offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                        offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i + 1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                        if (offsetX1 > maxCanvasWidth) {
                            maxCanvasWidth = offsetX1;
                        }
                        if (offsetX2 > maxCanvasWidth) {
                            maxCanvasWidth = offsetX2;
                        }
                        if (offsetY1 > maxCanvasHeight) {
                            maxCanvasHeight = offsetY1;
                        }
                        if (offsetY2 > maxCanvasHeight) {
                            maxCanvasHeight = offsetY2;
                        }

                    }
                // }
            }

            //do the scale here if needed - here we know the size
            var scaleFactor = 0;

            if ((maxCanvasHeight / 800) > (maxCanvasWidth / 600)) {
                scaleFactor = 800 / maxCanvasHeight;
            } else {
                scaleFactor = 600 / maxCanvasWidth;
            }

            //if scalefactor is too large then reduce it
            while (((scaleFactor * maxCanvasWidth) > 600) || ((scaleFactor * maxCanvasHeight) > 800)) {
                scaleFactor = scaleFactor - (scaleFactor * 0.01);
            }

            /////////****************general / basic canvas******************

            var c = document.getElementById("generalCanvas");
            var ctx = c.getContext("2d");

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, c.width, c.height);

            ctx.scale(scaleFactor, scaleFactor);
            //adjust font size according to scale
            ctx.font = "20px Arial";
            // if (scaleFactor < 0.75) {
            //     ctx.font = "20px Arial";
            // }
            // if (scaleFactor < 0.5) {
            //     ctx.font = "40px Arial";
            // }
            // if (scaleFactor < 0.25) {
            //     ctx.font = "60px Arial";
            // }


            for (j = 0; j < db.areaLayer.length; j++) {
            // if (areas[j].deleted == 0) {

                var areaLeftBorder = 180;
                var areaRightBorder = -180;
                var areaTopBorder = -90;
                var areaBottomBorder = 90;

                for (i = 0; i < db.areaLayer[j]._latlngs[0].length; i++) {



                    if (db.areaLayer[j]._latlngs[0][i].lat > areaTopBorder) {
                        areaTopBorder = db.areaLayer[j]._latlngs[0][i].lat;
                    }
                    if (db.areaLayer[j]._latlngs[0][i].lat < areaBottomBorder) {
                        areaBottomBorder = db.areaLayer[j]._latlngs[0][i].lat;
                    }

                    if (db.areaLayer[j]._latlngs[0][i].lng < areaLeftBorder) {
                        areaLeftBorder = db.areaLayer[j]._latlngs[0][i].lng;
                    }
                    if (db.areaLayer[j]._latlngs[0][i].lng > areaRightBorder) {
                        areaRightBorder = db.areaLayer[j]._latlngs[0][i].lng;
                    }


                }

                offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, areaLeftBorder), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, areaRightBorder), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                offsetY1 = 20 + (getDistance(new google.maps.LatLng(areaTopBorder, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                offsetY2 = 20 + (getDistance(new google.maps.LatLng(areaBottomBorder, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                ctx.fillStyle = "black";
                ctx.save();
                // ctx.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);
                // ctx.textAlign = "center";
                // ctx.fillText(calulateArea(db.area[j]), 0, 0);
                ctx.restore();
            // }
            }

            for (j = 0; j < db.areaLayer.length; j++) {
                    // if (areas[j].deleted == 0) {
                    for (i = 0; i < db.areaLayer[j]._latlngs[0].length - 1; i++) {

                    offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                    offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                    ctx.beginPath();
                    ctx.moveTo(offsetX1, offsetY1);
                    ctx.lineTo(offsetX2, offsetY2);
                    ctx.stroke();
                    ctx.save();
                    ctx.restore();
                    }
                    //last line
                    offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][0].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][0].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                    ctx.beginPath();
                    ctx.moveTo(offsetX1, offsetY1);
                    ctx.lineTo(offsetX2, offsetY2);
                    ctx.stroke();
                    ctx.restore();
                    // }
                }

            for (i = 0; i < db.lineLayer.length; i++) {

            // if (lines[i].deleted == 0) {
                for (j = 0; j < db.lineLayer[i]._latlngs.length - 1; j++){

                    offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                    offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                    ctx.beginPath();
                    ctx.moveTo(offsetX1, offsetY1);
                    ctx.lineTo(offsetX2, offsetY2);                    

                    if (db.lineTool[i] == "Ridge") {
                        ctx.strokeStyle = '#ff0000';
                    }
                    if (db.lineTool[i] == "Hip") {
                        ctx.strokeStyle = '#ffa500';
                    }
                    if (db.lineTool[i] == "Rake") {
                        ctx.strokeStyle = '#008000';
                    }
                    if (db.lineTool[i] == "Valley") {
                        ctx.strokeStyle = '#0000ff';
                    }
                    if (db.lineTool[i] == "Eave") {
                        ctx.strokeStyle = '#800080';
                    }
                    if (db.lineTool[i] == "Step-flashing") {
                        ctx.strokeStyle = '#008080';
                    }
                    if (db.lineTool[i] == "Base-flashing") {
                        ctx.strokeStyle = '#504940';
                    }
                    if (db.lineTool[i] == "Vent") {
                        ctx.strokeStyle = '#080142';
                    }
                    if (db.linePitch[i] == undefined) {
                        ctx.strokeStyle = '#5c8a00';
                    }

                    ctx.stroke();
                    ctx.fillStyle = "black";
                    ctx.save();
                }
                ctx.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);
                ctx.rotate(textDirection(offsetX1, offsetY1, offsetX2, offsetY2) * Math.PI / 180);
                ctx.translate(-10, -3);
                ctx.fillText(getFeetInchesLine(db.line[i]), 0, 0);
                ctx.restore();
        }




    var dataURL = c.toDataURL("image/png");
    
    /////////****************lines canvas******************

    var c2 = document.getElementById("linesCanvas");
    var ctx2 = c2.getContext("2d");
    ctx2.fillStyle = "white";
    ctx2.fillRect(0, 0, c2.width, c2.height);

    ctx2.scale(scaleFactor, scaleFactor);
    ctx2.font = "bold 20px Arial";
    // if (scaleFactor < 0.75) {
    //     ctx2.font = "bold 20px Arial";
    // }
    // if (scaleFactor < 0.5) {
    //     ctx2.font = "bold 40px Arial";
    // }
    // if (scaleFactor < 0.25) {
    //     ctx2.font = "bold 60px Arial";
    // }


    // Outside

    for (j = 0; j < db.areaLayer.length; j++) {
            // if (areas[j].deleted == 0) {
            for (i = 0; i < db.areaLayer[j]._latlngs[0].length - 1; i++) {

            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx2.beginPath();
            ctx2.moveTo(offsetX1, offsetY1);
            ctx2.lineTo(offsetX2, offsetY2);


            ctx2.fillStyle = "black";
            ctx2.stroke();
            ctx2.save();

            ctx2.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);

            ctx2.rotate(textDirection(offsetX1, offsetY1, offsetX2, offsetY2) * Math.PI / 180);
            ctx2.translate(-10, -3);
            ctx2.fillStyle = "white";
            ctx2.fillRect(0,0,ctx2.measureText(getFeetInchesLine(db.areaSegments[j][i])).width,-30);
            ctx2.fillStyle = "black";

            ctx2.fillText(getFeetInchesLine(db.areaSegments[j][i]), 0, 0);
            ctx2.restore();
            }
            //last line
            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][0].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][0].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);


            ctx2.beginPath();
            ctx2.moveTo(offsetX1, offsetY1);
            ctx2.lineTo(offsetX2, offsetY2);
            // ctx2.lineWidth = 4;
            ctx2.stroke();
            ctx2.save();

            ctx2.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);
            ctx2.rotate(textDirection(offsetX1, offsetY1, offsetX2, offsetY2) * Math.PI / 180);
            ctx2.translate(-10, -3);
            ctx2.fillStyle = "white";
            ctx2.fillRect(0,0,ctx2.measureText(getFeetInchesLine(db.areaSegments[j][i])).width,-30);
            ctx2.fillStyle = "black";
            ctx2.fillText(getFeetInchesLine(db.areaSegments[j][i]), 0, 0);
            ctx2.restore();

        }

    for (i = 0; i < db.lineLayer.length; i++) {

            for (j = 0; j < db.lineLayer[i]._latlngs.length - 1; j++){

                offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
                offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

                ctx2.beginPath();
                ctx2.moveTo(offsetX1, offsetY1);
                ctx2.lineTo(offsetX2, offsetY2);

                if (db.lineTool[i] == "Ridge") {
                    ctx2.strokeStyle = '#ff0000';
                }
                if (db.lineTool[i] == "Hip") {
                    ctx2.strokeStyle = '#ffa500';
                }
                if (db.lineTool[i] == "Rake") {
                    ctx2.strokeStyle = '#008000';
                }
                if (db.lineTool[i] == "Valley") {
                    ctx2.strokeStyle = '#0000ff';
                }
                if (db.lineTool[i] == "Eave") {
                    ctx2.strokeStyle = '#800080';
                }
                if (db.lineTool[i] == "Step-flashing") {
                    ctx2.strokeStyle = '#008080';
                }
                if (db.lineTool[i] == "Base-flashing") {
                    ctx2.strokeStyle = '#504940';
                }
                if (db.lineTool[i] == "Vent") {
                    ctx2.strokeStyle = '#080142';
                }
                if (db.linePitch[i] == undefined) {
                    ctx2.strokeStyle = '#5c8a00';
                }

                ctx2.stroke();
                ctx2.save();
            }

            ctx2.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);

            ctx2.rotate(textDirection(offsetX1, offsetY1, offsetX2, offsetY2) * Math.PI / 180);
            ctx2.translate(-10, -3);
            ctx2.fillStyle = "white";
            //ctx2.fillRect(0,0,ctx2.measureText(getFeetInchesLine(db.line[i])).width+10,-30);
            ctx2.fillStyle = "black";
            //ctx2.fillText(getFeetInchesLine(db.line[i]), 0, 0);

            ctx2.restore();
    }


var dataURL2 = c2.toDataURL("image/png");


/////////****************areas canvas******************

var c3 = document.getElementById("areasCanvas");
var ctx3 = c3.getContext("2d");
ctx3.clearRect(0, 0, c3.width, c3.height);
ctx3.fillStyle = "white";
ctx3.fillRect(0, 0, c3.width, c3.height);

ctx3.scale(scaleFactor, scaleFactor);
ctx3.font = "20px Arial";
// if (scaleFactor < 0.75) {
//     ctx3.font = "20px Arial";
// }
// if (scaleFactor < 0.5) {
//     ctx3.font = "40px Arial";
// }
// if (scaleFactor < 0.25) {
//     ctx3.font = "60px Arial";
// }


for (i = 0; i < db.lineLayer.length; i++) {

    // if (lines[i].deleted == 0) {
        for (j = 0; j < db.lineLayer[i]._latlngs.length - 1; j++) {
            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx3.beginPath();
            ctx3.moveTo(offsetX1, offsetY1);
            ctx3.lineTo(offsetX2, offsetY2);
            ctx3.strokeStyle = '#000000';
            ctx3.stroke();
        }
    // }
}

for (j = 0; j < db.areaLayer.length; j++) {
    // if (areas[j].deleted == 0) {

        var areaLeftBorder = 180;
        var areaRightBorder = -180;
        var areaTopBorder = -90;
        var areaBottomBorder = 90;

        for (i = 0; i < db.areaLayer[j]._latlngs[0].length; i++) {



            if (db.areaLayer[j]._latlngs[0][i].lat > areaTopBorder) {
                areaTopBorder = db.areaLayer[j]._latlngs[0][i].lat;
            }
            if (db.areaLayer[j]._latlngs[0][i].lat < areaBottomBorder) {
                areaBottomBorder = db.areaLayer[j]._latlngs[0][i].lat;
            }

            if (db.areaLayer[j]._latlngs[0][i].lng < areaLeftBorder) {
                areaLeftBorder = db.areaLayer[j]._latlngs[0][i].lng;
            }
            if (db.areaLayer[j]._latlngs[0][i].lng > areaRightBorder) {
                areaRightBorder = db.areaLayer[j]._latlngs[0][i].lng;
            }


        }

        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, areaLeftBorder), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, areaRightBorder), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

        offsetY1 = 20 + (getDistance(new google.maps.LatLng(areaTopBorder, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY2 = 20 + (getDistance(new google.maps.LatLng(areaBottomBorder, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

        ctx3.fillStyle = "black";
        ctx3.save();
        ctx3.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);
        ctx3.textAlign = "center";
        ctx3.fillText(calulateArea(db.area[j]), 0, 0);
        ctx3.restore();
    // }
}

for (j = 0; j < db.areaLayer.length; j++) {
    // if (areas[j].deleted == 0) {
        for (i = 0; i < db.areaLayer[j]._latlngs[0].length - 1; i++) {

            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx3.beginPath();
            ctx3.moveTo(offsetX1, offsetY1);
            ctx3.lineTo(offsetX2, offsetY2);


            ctx3.fillStyle = "black";
            ctx3.stroke();
            ctx3.fillStyle = "black";
            ctx3.save();
        }
        //last line
        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][0].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][0].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);


        ctx3.beginPath();
        ctx3.moveTo(offsetX1, offsetY1);
        ctx3.lineTo(offsetX2, offsetY2);


        ctx3.fillStyle = "black";
        ctx3.stroke();
        ctx3.fillStyle = "black";
        ctx3.save();
    // }
}

var dataURL3 = c3.toDataURL("image/png");
////////*****************pitch canvas******************

var c4 = document.getElementById("pitchCanvas");
var ctx4 = c4.getContext("2d");
ctx4.fillStyle = "white";
ctx4.fillRect(0, 0, c4.width, c4.height);

ctx4.scale(scaleFactor, scaleFactor);
ctx4.font = "20px Arial";
// if (scaleFactor < 0.75) {
//     ctx4.font = "20px Arial";
// }
// if (scaleFactor < 0.5) {
//     ctx4.font = "40px Arial";
// }
// if (scaleFactor < 0.25) {
//     ctx4.font = "60px Arial";
// }


for (j = 0; j < db.areaLayer.length; j++) {
    // if (areas[j].deleted == 0) {

        var areaLeftBorder = 180;
        var areaRightBorder = -180;
        var areaTopBorder = -90;
        var areaBottomBorder = 90;

        for (i = 0; i < db.areaLayer[j]._latlngs[0].length; i++) {



            if (db.areaLayer[j]._latlngs[0][i].lat > areaTopBorder) {
                areaTopBorder = db.areaLayer[j]._latlngs[0][i].lat;
            }
            if (db.areaLayer[j]._latlngs[0][i].lat < areaBottomBorder) {
                areaBottomBorder = db.areaLayer[j]._latlngs[0][i].lat;
            }

            if (db.areaLayer[j]._latlngs[0][i].lng < areaLeftBorder) {
                areaLeftBorder = db.areaLayer[j]._latlngs[0][i].lng;
            }
            if (db.areaLayer[j]._latlngs[0][i].lng > areaRightBorder) {
                areaRightBorder = db.areaLayer[j]._latlngs[0][i].lng;
            }


        }

        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, areaLeftBorder), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, areaRightBorder), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

        offsetY1 = 20 + (getDistance(new google.maps.LatLng(areaTopBorder, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY2 = 20 + (getDistance(new google.maps.LatLng(areaBottomBorder, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

        ctx4.fillStyle = "black";
        ctx4.save();
        ctx4.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);
        if ( db.areaPitch[j] != undefined && db.areaPitch[j] != 0 && db.areaPitch[j] != null ) {
            ctx4.fillText(db.areaPitch[j], 0, 0);
        }
        ctx4.restore();
    // }
}

for (j = 0; j < db.areaLayer.length; j++) {
    // if (areas[j].deleted == 0) {
        for (i = 0; i < db.areaLayer[j]._latlngs[0].length - 1; i++) {
            console.log(db.areaLayer[j]._latlngs[0])
            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx4.beginPath();
            ctx4.moveTo(offsetX1, offsetY1);
            ctx4.lineTo(offsetX2, offsetY2);


            ctx4.fillStyle = "black";
            ctx4.stroke();
            ctx4.fillStyle = "black";
            ctx4.save();

            ctx4.restore();

        }
        //last line
        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][0].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][0].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);


        ctx4.beginPath();
        ctx4.moveTo(offsetX1, offsetY1);
        ctx4.lineTo(offsetX2, offsetY2);


        ctx4.fillStyle = "black";
        ctx4.stroke();
        ctx4.save();
         // ctx3.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);
    // }
}

for (i = 0; i < db.lineLayer.length; i++) {

// if (lines[i].deleted == 0) {
    for (j = 0; j < db.lineLayer[i]._latlngs.length - 1; j++) {
        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

        ctx4.beginPath();
        ctx4.moveTo(offsetX1, offsetY1);
        ctx4.lineTo(offsetX2, offsetY2);
        ctx4.strokeStyle = '#000000';
        if(db.linePitch[i] != 0)
        {
            //ctx4.strokeStyle = 'red';
        }
        ctx4.stroke();
        ctx4.save();

    }
        ctx4.translate((offsetX1 + offsetX2) / 2, (offsetY1 + offsetY2) / 2);
        ctx4.rotate(textDirection(offsetX1, offsetY1, offsetX2, offsetY2) * Math.PI / 180);
        ctx4.translate(-10, -3);
        //ctx4.fillStyle = "red";

        if ( db.linePitch[i] != undefined && db.linePitch[i] != 0 && db.linePitch[i] != null ) {
           // ctx4.fillText(db.linePitch[i], 0, 0);
        }
        ctx4.restore();

// }
}

var dataURL4 = c4.toDataURL("image/png");




/////////****************marker canvas******************

var c5 = document.getElementById("ventCanvas");
var ctx5 = c5.getContext("2d");
ctx5.fillStyle = "white";
ctx5.fillRect(0, 0, c5.width, c5.height);

ctx5.scale(scaleFactor, scaleFactor);
ctx5.font = "20px Arial";
// if (scaleFactor < 0.75) {
//     ctx5.font = "20px Arial";
// }
// if (scaleFactor < 0.5) {
//     ctx5.font = "40px Arial";
// }
// if (scaleFactor < 0.25) {
//     ctx5.font = "60px Arial";
// }



let d = 20;
for (i = 0; i < db.markerLayer.length; i++) {

            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.markerLayer[i]._latlng.lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.markerLayer[i]._latlng.lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx5.beginPath();
            // ctx5.moveTo(offsetX1, offsetY1);
            ctx5.arc(offsetX1, offsetY1, 20, 0, 2 * Math.PI);
            ctx5.lineWidth = 3
            if(db.markerTool[i] == 'Storm-Damage') {
                ctx5.strokeStyle = '#FFFFFF';
            } else {
                ctx5.strokeStyle = getColor(db.markerFor[i]);
            }

            ctx5.stroke();
            ctx5.fillStyle = "black";
            ctx5.save();

            // ctx5.fillText(i+1, offsetX1-7, offsetY1+7);
            // ctx5.fillText(parseInt(i+1)+'). '+db.markerFor[i], 0, d);
            // ctx5.translate(25, 3);
            ctx5.restore();

            d = d + 20 + 5;
    // }
}


for (i = 0; i < db.lineLayer.length; i++) {

    // if (lines[i].deleted == 0) {
        for (j = 0; j < db.lineLayer[i]._latlngs.length - 1; j++) {
            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx5.beginPath();
            ctx5.moveTo(offsetX1, offsetY1);
            ctx5.lineTo(offsetX2, offsetY2);
            ctx5.strokeStyle = '#000000';
            ctx5.stroke();
        }
    // }
}

for (j = 0; j < db.areaLayer.length; j++) {
    // if (areas[j].deleted == 0) {
        for (i = 0; i < db.areaLayer[j]._latlngs[0].length - 1; i++) {

            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx5.beginPath();
            ctx5.moveTo(offsetX1, offsetY1);
            ctx5.lineTo(offsetX2, offsetY2);


            ctx5.fillStyle = "black";
            ctx5.stroke();
            ctx5.fillStyle = "black";
            ctx5.save();
        }
        //last line
        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][0].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][0].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);


        ctx5.beginPath();
        ctx5.moveTo(offsetX1, offsetY1);
        ctx5.lineTo(offsetX2, offsetY2);


        ctx5.fillStyle = "black";
        ctx5.stroke();
        ctx5.fillStyle = "black";
        ctx5.save();
    // }
}


var dataURL5 = c5.toDataURL("image/png");

//end ctx5


/////////****************marker canvas******************

var c6 = document.getElementById("stormCanvas");
var ctx6 = c6.getContext("2d");
ctx6.fillStyle = "white";
ctx6.fillRect(0, 0, c6.width, c6.height);

ctx6.scale(scaleFactor, scaleFactor);
ctx6.font = "20px Arial";
// if (scaleFactor < 0.75) {
//     ctx6.font = "20px Arial";
// }
// if (scaleFactor < 0.5) {
//     ctx6.font = "40px Arial";
// }
// if (scaleFactor < 0.25) {
//     ctx6.font = "60px Arial";
// }

for (i = 0; i < db.markerLayer.length; i++) {

            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.markerLayer[i]._latlng.lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.markerLayer[i]._latlng.lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx6.beginPath();
            // ctx6.moveTo(offsetX1, offsetY1);
            ctx6.arc(offsetX1, offsetY1, 20, 0, 2 * Math.PI);
            ctx6.lineWidth = 3

            if(db.markerTool[i] == 'Storm-Damage') {
                ctx6.strokeStyle = getColor(db.markerFor[i]);
            } else {
                ctx6.strokeStyle = '#fff';
            }


            ctx6.stroke();
            ctx6.fillStyle = "black";
            ctx6.save();

            // ctx6.fillText(i+1, offsetX1-7, offsetY1+7);
            // ctx6.fillText(parseInt(i+1)+'). '+db.markerFor[i], 0, d);
            // ctx6.translate(25, 3);
            ctx6.restore();

            d = d + 20 + 5;
    // }
}


for (i = 0; i < db.lineLayer.length; i++) {

    // if (lines[i].deleted == 0) {
        for (j = 0; j < db.lineLayer[i]._latlngs.length - 1; j++) {
            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.lineLayer[i]._latlngs[j+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.lineLayer[i]._latlngs[j+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx6.beginPath();
            ctx6.moveTo(offsetX1, offsetY1);
            ctx6.lineTo(offsetX2, offsetY2);
            ctx6.strokeStyle = '#000000';
            ctx6.stroke();
        }
    // }
}

for (j = 0; j < db.areaLayer.length; j++) {
    // if (areas[j].deleted == 0) {
        for (i = 0; i < db.areaLayer[j]._latlngs[0].length - 1; i++) {

            offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][i+1].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
            offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][i+1].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);

            ctx6.beginPath();
            ctx6.moveTo(offsetX1, offsetY1);
            ctx6.lineTo(offsetX2, offsetY2);


            ctx6.fillStyle = "black";
            ctx6.stroke();
            ctx6.fillStyle = "black";
            ctx6.save();
        }
        //last line
        offsetX1 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetX2 = 20 + (getDistance(new google.maps.LatLng(topLeftY, db.areaLayer[j]._latlngs[0][0].lng), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY1 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][(db.areaLayer[j]._latlngs[0].length - 1)].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);
        offsetY2 = 20 + (getDistance(new google.maps.LatLng(db.areaLayer[j]._latlngs[0][0].lat, topLeftX), new google.maps.LatLng(topLeftY, topLeftX)) * meterPixelConst);


        ctx6.beginPath();
        ctx6.moveTo(offsetX1, offsetY1);
        ctx6.lineTo(offsetX2, offsetY2);


        ctx6.fillStyle = "black";
        ctx6.stroke();
        ctx6.fillStyle = "black";
        ctx6.save();
    // }
}


var dataURL6 = c6.toDataURL("image/png");

//end ctx6
updateArea();
updateLine();
//get google images

//send the data

var roofPacked = [];
totalArea = totalAreaPdf
roofPacked.push(calulateArea(totalArea));
roofPacked.push(getFeetInchesLine(totalRidge));
roofPacked.push(getFeetInchesLine(totalHip));
roofPacked.push(getFeetInchesLine(totalRake));
roofPacked.push(getFeetInchesLine(totalEave));
roofPacked.push(getFeetInchesLine(totalValley));
roofPacked.push(getFeetInchesLine(totalPitchChange));
roofPacked.push(getFeetInchesLine(totalStepFlashing));
roofPacked.push(getFeetInchesLine(totalBaseFlashing));
roofPacked.push(getFeetInchesLine(totalVent));
roofPacked.push(db.area.length);
roofPacked.push(calulateArea(totalTwoStories));

roofPacked.push(calulateArea(totalLowPitch));
roofPacked.push(calulateArea(totalSteep89));
roofPacked.push(calulateArea(totalSteep10));
roofPacked.push(calulateArea(totalPitch3));


var roofData1 = JSON.stringify(roofPacked);
var obj = JSON.parse(roofData1);
var roofData = JSON.stringify(obj);

var roofPackedNumeric = [];

roofPackedNumeric.push(totalAreaPdf);
roofPackedNumeric.push(totalRidge);
roofPackedNumeric.push(totalHip);
roofPackedNumeric.push(totalRake);
roofPackedNumeric.push(totalEave);
roofPackedNumeric.push(totalValley);
roofPackedNumeric.push(totalPitchChange);
roofPackedNumeric.push(db.area.length);
roofPackedNumeric.push(totalStepFlashing);
roofPackedNumeric.push(totalBaseFlashing);
roofPackedNumeric.push(totalVent);
roofPackedNumeric.push(totalTwoStories);

roofPackedNumeric.push(totalLowPitch);
roofPackedNumeric.push(totalSteep89);
roofPackedNumeric.push(totalSteep10);
roofPackedNumeric.push(totalPitch3);

var roofDataNumeric = JSON.stringify(roofPackedNumeric);

rbCreatePdf({
    project:dbProject,
    encodedImage: dataURL,
    encodedImage2: dataURL2,
    encodedImage3: dataURL3,
    encodedImage4: dataURL4,
    encodedImage5: dataURL5,
    encodedImage6: dataURL6,
    estimate_id: jobID,
    roofDataString: roofData,
    roofDataNumeric: roofDataNumeric
}
    )

    /*
//In the end send the content to controller in order to generate pdf
$("#lmsg").text("Please wait while the PDFs are being generated!");
$.ajax({
    url: '/measurements/new/createPdf',
    type: "POST",
    data: ({
        '_token': $('meta[name="csrf-token"]').attr('content'),
        encodedImage: dataURL,
        encodedImage2: dataURL2,
        encodedImage3: dataURL3,
        encodedImage4: dataURL4,
        encodedImage5: dataURL5,
        encodedImage6: dataURL6,
        estimate_id: jobID,
        roofDataString: roofData,
        roofDataNumeric: roofDataNumeric
    }),
    dataType: "json",
    success: function(data) {
        $("#lmsg").text("PDF documents are generated. Please find them in the Estimates section!");
        if(data.success){
            var link = document.createElement('a');
            link.href = data.link;
            link.target ="_blank";
            link.setAttribute('download',data.file_name);
            link.click();
            link.remove();
            document.getElementById('loader').style.display='none';


            //$('#show_navigation_btn').modal('show');

            // location.reload();
        }
    },
    always: function(data) {
        $("#lmsg").text("PDF documents are generated. Please find them in the Estimates section!");
        document.getElementById('loader').style.display='none'
    },
    error: function(data) {
        console.log("there was an error");
        $("#lmsg").text("PDF documents are generated. Please find them in the Estimates section!"); //PDFs are generated but the response does not come back properly.
        document.getElementById('loader').style.display='none'
    }
    });
*/
document.getElementById('loader').style.display='none'
}

$(window).on('load', function(){
        setTimeout(function(){
            $('.fa-list').click();    }, 500);
        })

        $(document).ready(function(){
            $('#globalPitch').val(pitch).change();
        })