const Request = require("request");

var express = require('express');
var app = express();
var port = process.env.port || 1337;

var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json());

var productController = require('./Controller/ProductController')();
app.use("/api/products", productController);




app.get("/api/ComputerVision",(req,res)=>
{

    
        const subscriptionKey = 'c7ff783c4d0e4138a671a340e84e7127';

        const uriBase =
            'https://centralindia.api.cognitive.microsoft.com/vision/v1.0/analyze';

        const imageUrl =
            'https://qph.fs.quoracdn.net/main-qimg-e02166fb1dd901d417028e6fddb3ac4b';

        
        const params = {
            'visualFeatures': 'Categories,Description,Color',
            'details': '',
            'language': 'en'
        };

        const options = {
            uri: uriBase,
            qs: params,
            body: '{"url": ' + '"' + imageUrl + '"}',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };
        Request.post(options, (error, response, body) => 
        {
            if(error) 
            {
                return console.dir(error);
            }
            //console.dir(JSON.parse(body));

            res.json(body);
        });

});

app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + "Started at :- " + datetime;
    console.log(message);
});

