import fs from "fs";
const fileBuffer = await fs.promises.readFile("Hello.txt");
const uInt8Array = new Uint16Array(fileBuffer);
console.log(uInt8Array);
