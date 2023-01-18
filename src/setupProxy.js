const {createProxyMiddleware} =require("http-proxy-middleware")

module.exports=function(app){

    app.use(['/api/','/measurements','/js/','/oauth2/'], createProxyMiddleware({target:"http://localhost:9010"}))
}