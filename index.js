const express = require('express');

const app = express()
const cors = require('cors')
const port = 3000
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
app.post('/connectPrinter', async (req, res) => {
  try{
    let myPrinter
    if(req.body.printerType && req.body.printerType === "EPSON"){
      myPrinter = "EPSON"
    }else if(req.body.printerType && req.body.printerType === "STAR"){
      myPrinter = "STAR"
    }
  
    let printer = new ThermalPrinter({
      type: myPrinter === "EPSON" ? PrinterTypes.EPSON : PrinterTypes.STAR,
      interface: `tcp://${req.body.printerIP}:${req.body.printerPORT}`
    });
  
    const getModifierAnswer = (answers) => {
      for(const an of answers){
        return(`${an.name}x${an.count}`)
      }
    }
  
    printer.alignCenter();
    printer.println(req.body.date);
    printer.println(`table: ${req.body.table}`);
    printer.newLine();
    for(const item of req.body.items){
      printer.println(item.name);
      for(const modifiers of item.specialQuestions){
        printer.println(`${modifiers.question} : ${getModifierAnswer(modifiers.answers)}`)
        printer.drawLine();
      }
    }
    printer.cut();
    try {
      let execute = printer.execute()
      return res.status(200).json({msg: "DONE"})
    } catch (error) {
      console.log("Print failed:", error);
    }
  }
  catch(e){
    console.log(e)
  }
  
})

app.listen(process.env.PORT || port, () => {
  console.log(`Print server is listening on ${process.env.PORT || port}`)
})

process.on('uncaughtException', (err) => {
  console.log(err)
})