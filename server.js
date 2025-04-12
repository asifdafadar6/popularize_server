const express = require('express');
const connection = require('./database/dbconnection'); 
const router = require('./router/router');
require('dotenv').config();
const app = express();

// const cors = require('cors');

// app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', ''); // Allow all origins (), 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);
app.use("/uploads", express.static("public/uploads"));

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server Running on http://localhost:${PORT} `);
});