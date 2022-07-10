const express = require('express');

const app = express()
const cors = require('cors');
const sendPrintRequest = require('./print');
const port = 3004
app.use(express.json())
app.use(cors())
const https = require("https");
const fs = require("fs");

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

/*
Arguments:
  printerType //EPSON or STAR
  printerIP
  printerPORT
  date
  table
  items //ordered items - format:[{name: "", specialQuestions: [{question: "", answers: [{name: "", count: ""}]}]}]
*/
app.post('/print', async (req, res) => {
  try {
    const ip = req.body.printerIp;
    const orders = req.body.orders;
    const orderType = orders[0].orderType;
    sendPrintRequest(ip, orders, orderType);
    return res.status(200).send();
  }
  catch (e) {
    console.log(e)
    return res.status(500).send();
  }

})

https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("ca.key"),
      cert: fs.readFileSync("ca.crt"),
    },
    app
  )
  .listen(3004, () => {
    console.log("serever is runing at port 3004");
  });

// app.listen(process.env.PORT || port, () => {
//   console.log(`Print server is listening on ${process.env.PORT || port}`)
// })

process.on('uncaughtException', (err) => {
  console.log(err)
  return res.status(500).send();
})