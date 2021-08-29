import fs            from 'fs';
import path          from 'path';

import parseDocData  from './utils/parseDocData.mjs';

console.log(`Parsing foundry.js doc data for version: ${process.env.TARGET}`);

const data = parseDocData(process.env.TARGET);

const filePath = `.${path.sep}${process.env.TARGET}.js`;

let output = `// Global classes, functions, variables defined in commons module & foundry.js (${process.env.TARGET}).
module.exports = {
  "globals": {
    // Other
    "easyrtc": "readonly",
    "Handlebars": "readonly",
    "HandlebarsIntl": "readonly",\r\n`;

if (data.common.classes.length)
{
   output +=`\r\n    // Commons module Classes\r\n`;

   data.common.classes.forEach((entry) =>
   {
      output += `    "${entry}": "readonly",\r\n`;
   });
}

if (data.common.functions.length)
{
   output +=`\r\n    // Commons module Functions\r\n`;

   data.common.functions.forEach((entry) =>
   {
      output += `    "${entry}": "readonly",\r\n`;
   });
}

if (data.common.variables.length)
{
   output +=`\r\n    // Commons module Variables\r\n`;

   data.common.variables.forEach((entry) =>
   {
      output += `    "${entry}": "readonly",\r\n`;
   });
}

if (data.foundry.classes.length)
{
   output +=`\r\n    // Foundry.js Classes\r\n`;

   data.foundry.classes.forEach((entry) =>
   {
      output += `    "${entry}": "readonly",\r\n`;
   });
}

if (data.foundry.functions.length)
{
   output +=`\r\n    // Foundry.js Functions\r\n`;

   data.foundry.functions.forEach((entry) =>
   {
      output += `    "${entry}": "readonly",\r\n`;
   });
}

if (data.foundry.variables.length)
{
   output +=`\r\n    // Foundry.js Variables\r\n`;

   data.foundry.variables.forEach((entry, index, array) =>
   {
      // Do not insert a comma for the last index in the array.
      output += `    "${entry}": "readonly"${index === array.length - 1 ? '' : ','}\r\n`;
   });
}

output +=
`  }
}`;

fs.writeFileSync(filePath, output, 'utf8');
