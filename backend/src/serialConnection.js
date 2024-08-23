import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

async function connectSerial(serialPortPath, baudRate, onDataCallback) {
  return new Promise((resolve, reject) => {
    const port = new SerialPort({path: serialPortPath, baudRate: baudRate }, (err) => {
      if (err) {
        return reject(err);
      }
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    parser.on('data', onDataCallback);

    resolve(port);
  });
}


export default connectSerial;
