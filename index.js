const express = require('express')
const app = express()

const fs = require('fs');
const path = require('path');
const port = 5000
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const axios = require('axios');
const YAML = require('yamljs');
const { FTPClient } = require('basic-ftp');



app.use(bodyParser.json());


const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors())



const webRoutes = require("./routes");
app.use(webRoutes);

// app.use(express.static(path.join(__dirname, "public")));


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`)
})