const express = require('express');
const config = require('./config');
const app = express()
const cors = require('cors');
const sendPrintRequest = require('./print');
const port = 3004
app.use(express.json())
app.use(cors())

const { io } = require('socket.io-client');

const socket = io(config.SERVER, {query: { restName: config.restName } });

app.get('/', (req, res) => {
  return res.status(200).json({ msg: "hello printer" });
})

socket.on('print', (data) => {
  const ip = data.ip;
  const orders = data.orders;
  const orderType = orders[0].orderType;
  sendPrintRequest(ip, orders, orderType);
})

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


app.listen(port, () => {
  console.log("serever is runing at port 3004");
});

process.on('uncaughtException', (err) => {
  console.log(err)
  return res.status(500).send();
})