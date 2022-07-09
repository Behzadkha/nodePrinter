const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;


const sendPrintRequest = async (ip, orders, orderType) => {
  try {
    let printer = new ThermalPrinter({
      type: PrinterTypes.STAR,                                  // Printer type: 'star' or 'epson'
      interface: `tcp://${ip}`,                       // Printer interface
      characterSet: 'SLOVENIA',                                 // Printer character set - default: SLOVENIA
      removeSpecialCharacters: false,                           // Removes special characters - default: false
      // Set character for lines - default: "-"
      options: {                                                 // Additional options
        timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
      }
    });
    const isConnected = await printer.isPrinterConnected();
    console.log(isConnected)
    if (isConnected) {
      printer.alignCenter();
      if (orderType === 'table') {
        printer.println(`Table: ${orders[0].table}`);
      } else {
        printer.println(`Online: ${orders[0].customerInfo.name}`);
      }
      printer.println(orders[0].date);
      printer.alignLeft();
      for (const order of orders) {
        printer.drawLine();
        printer.bold(true);
        printer.println(`${order.count} x ${order.name}`);
        printer.bold(false);
        for (const modifier of order.specialQuestions) {
          for (const answer of modifier.answers) {
            printer.println(`   ${answer.name}     ${answer.count}`)
          }
        }

      }
      printer.cut();
    }

    await printer.execute();
  } catch (error) {
    console.log(error, 'printer error');
  }
}

module.exports = sendPrintRequest;