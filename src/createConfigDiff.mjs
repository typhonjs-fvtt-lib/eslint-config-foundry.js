import fs         from 'fs';
import path       from 'path';

import parseDiff  from './utils/parseDiff.mjs';

const versionString = `${process.env.PREVIOUS}-${process.env.NEXT}`;

console.log(`Parsing foundry.js doc data for diff config - version: ${versionString}`);

const data = parseDiff(process.env.PREVIOUS, process.env.NEXT);

const filePath = `.${path.sep}diff-${versionString}.js`;

let output = `// Diff set of classes, functions, variables no longer defined on the script and global scope. (${versionString}).
module.exports = {
  "rules": {
    "no-restricted-globals": [
      "error",`;

if (data.classes.length)
{
   output +=`\r\n      // Classes\r\n`;

   data.classes.forEach((entry) =>
   {
      output += `      {\r\n`;
      output += `        "name": "${entry}",\r\n`;
      output += `        "message": "FoundryVTT - No longer available on the global scope."\r\n`;
      output += `      },\r\n`;
   });
}

if (data.functions.length)
{
   output +=`\r\n      // Functions\r\n`;

   data.functions.forEach((entry) =>
   {
      output += `      {\r\n`;
      output += `        "name": "${entry}",\r\n`;
      output += `        "message": "FoundryVTT - No longer available on the global scope."\r\n`;
      output += `      },\r\n`;
   });
}

if (data.variables.length)
{
   output +=`\r\n      // Variables\r\n`;

   data.variables.forEach((entry, index, array) =>
   {
      output += `      {\r\n`;
      output += `        "name": "${entry}",\r\n`;
      output += `        "message": "FoundryVTT - No longer available on the global scope."\r\n`;
      output += `      }${index === array.length - 1 ? '' : ','}\r\n`;
   });
}

output +=
`    ]
  }
}`;

fs.writeFileSync(filePath, output, 'utf8');
