
const getBase64StringFromDataURL = (dataURL) => dataURL.replace('data:', '').replace(/^.+,/, '');

async function rbGetImage(src) {
        // Get the remote image as a Blob with the fetch API

    let blob = await (await fetch(src)).blob()

    return await new Promise(function(accept, reject) {

        const reader = new FileReader();
    

        reader.onloadend = () => {
            console.log(reader.result);
            // Logs data:image/jpeg;base64,wL2dvYWwgbW9yZ...
    
            // Convert to Base64 string
            const base64 = getBase64StringFromDataURL(reader.result);
            console.log(base64);
            //return base64
            // Logs wL2dvYWwgbW9yZ...
            accept(base64)
        };

        reader.readAsDataURL(blob);
    })

    
    /*
       return fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
            // Read the Blob as DataURL using the FileReader API
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader.result);
                // Logs data:image/jpeg;base64,wL2dvYWwgbW9yZ...

                // Convert to Base64 string
                const base64 = getBase64StringFromDataURL(reader.result);
                //console.log(base64);
                return base64
                // Logs wL2dvYWwgbW9yZ...
            };
            reader.readAsDataURL(blob);
        });
    */
}


function rbAddCenteredImage(doc,img, width, height,yOffset) {
    
    let xOffset = (doc.internal.pageSize.width / 2)  - (width / 2); 
    //console.log(xOffset)
    doc.addImage(img,'image/png',xOffset,yOffset,width,height)

}

function rbCenteredText(doc, text, font, style, size, yOffset) {

    let pageWidth = doc.internal.pageSize.width

    doc.setFont(font,style)
    doc.setFontSize(size)
    let tDim = doc.getTextDimensions(text)
    doc.text(text,pageWidth/2-tDim.w/2,yOffset)

    return yOffset+tDim.h
}

function rbText(doc, text, font, style, size, yOffset) {

    let pageWidth = doc.internal.pageSize.width

    doc.setFont(font,style)
    doc.setFontSize(size)
    let tDim = doc.getTextDimensions(text)
    doc.text(text,3,yOffset)

    return yOffset+tDim.h
}

function rbCenteredLinkText(doc, text, font, style, size, yOffset, linkOptions) {
    let currentColor=doc.getTextColor()

    let pageWidth = doc.internal.pageSize.width

    doc.setFont(font,style)
    doc.setFontSize(size)
    let tDim = doc.getTextDimensions(text)

    doc.setTextColor('#3366CC')
    doc.textWithLink(text,pageWidth/2-tDim.w/2,yOffset, linkOptions);

    doc.setTextColor(currentColor)
    return yOffset+tDim.h
}

async function rbCreateTitlePage(doc, project) {

    let logoImage = await rbGetImage('myroofbuilder-sm.png')


    rbAddCenteredImage(doc,logoImage,95,91, 20) //303 290

    let pageWidth = doc.internal.pageSize.width
    let lineWidth = doc.internal.pageSize.width*.90
    let margin90 = (pageWidth-lineWidth)/2
    doc.line(margin90,115,doc.internal.pageSize.width-(margin90*2),116)

    let pageYOffset=130
    pageYOffset=rbCenteredText(doc,'Measurement Report','Helvetica','Bold', 17,  pageYOffset ) + 5

    pageYOffset=rbCenteredText(doc,'PREPARED FOR','Helvetica','Bold', 12,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,project.job_name,'Helvetica','', 10,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,project.address_line_1,'Helvetica','', 10,  pageYOffset ) + 2
    if(project.address_line_2 && project.address_line_2.length>0) {
        pageYOffset=rbCenteredText(doc,project.address_line_2,'Helvetica','', 10,  pageYOffset ) + 2
    }
    pageYOffset=rbCenteredText(doc,project.city + ', ' + project.state + ' ' + project.zip,'Helvetica','', 10,  pageYOffset ) + 7


    pageYOffset=rbCenteredText(doc,'CREATED BY','Helvetica','Bold', 12,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,'Carlos Sanchez','Helvetica','', 10,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,'(513) 512-2363','Helvetica','', 10,  pageYOffset ) + 2
    pageYOffset=rbCenteredLinkText(doc,'csanchez419@gmail.com','Helvetica','', 10,  pageYOffset ,{ url: 'mailto:csanchez419@gmail.com' }) + 7

    pageYOffset=rbCenteredText(doc,'LOCATION','Helvetica','Bold', 12,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,'MyRoofbuilders.com','Helvetica','', 10,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,'6929 Tylersville Rd STE 15','Helvetica','', 10,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,'West Chester OH 45069','Helvetica','', 10,  pageYOffset ) + 2
    pageYOffset=rbCenteredText(doc,'(513) 847-4856','Helvetica','', 10,  pageYOffset ) + 7

    pageYOffset=rbCenteredLinkText(doc,'https://myroofbuilder.com/','Helvetica','', 10,  pageYOffset ,{ url: 'https://myroofbuilder.com/' }) + 2

    
}

async function addImagePage(doc, title, image) {
    doc.addPage()
    let pageYOffset=20

    pageYOffset=rbText(doc,title,'Helvetica','Bold', 14,  pageYOffset ) + 5

    //600,800 image size
    let width = doc.internal.pageSize.width *.95
    let height = width*800/600
    rbAddCenteredImage(doc,image,width,height, pageYOffset) //303 290
  
}

async function addMeasurementPage(doc,data) {
    const project=data.project

    let address=project.address_line_1 +  ', '

    if(project.address_line_2 && project.address_line_2.length>0) {
        address = address + project.address_line_2 + ', '
    }

    address = address + project.city + ', ' + project.state + ' ' + project.zip


    await addImagePage(doc,address,data.encodedImage2)
}

async function rbCreatePdf(data) {
    var doc = new jsPDF({unit:'mm'})

    await rbCreateTitlePage(doc,data.project)
    await addMeasurementPage(doc,data)

    await addImagePage(doc,'Area Diagram',data.encodedImage3)
    await addImagePage(doc,'Pitch Diagram',data.encodedImage4)
    await addImagePage(doc,'Vents and Skylights',data.encodedImage5)
    await addImagePage(doc,'Storm Damage',data.encodedImage6)
    
    /*
    console.log(data)
    let mapData = await rbGetImage('https://maps.googleapis.com/maps/api/staticmap?zoom=20&size=600x600&maptype=satellite&center='+ data.project.measurement.latitude +','+ data.project.measurement.longitude +'&key=AIzaSyDbJ9UTQKMCfpHrog8780sID2petvQrkWc')
    console.log(mapData)
    await addImagePage(doc,'Location Photo',mapData)
*/
    doc.save('report.pdf')
}

//rbCreatePdf()