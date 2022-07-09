const express = require('express');

const app = express()
const cors = require('cors');
const sendPrintRequest = require('./print');
const port = 3004
app.use(express.json())
app.use(cors())


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

app.listen(process.env.PORT || port, () => {
  console.log(`Print server is listening on ${process.env.PORT || port}`)
})

process.on('uncaughtException', (err) => {
  console.log(err)
  return res.status(500).send();
})