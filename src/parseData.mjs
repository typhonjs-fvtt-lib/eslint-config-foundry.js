import fs   from 'fs';
import path from 'path';

console.log(`Parsing foundry.js doc data for version: ${process.env.TARGET}`);

// Sanity check to make sure parent directory of DEPLOY_PATH exists.
const dataPath = `.${path.sep}data${path.sep}${process.env.TARGET}${path.sep}docData.json`;

if (!fs.existsSync(dataPath))
{
   throw new Error(`Doc data path does not exist: ${dataPath}`);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

if (!(data instanceof Array))
{
   throw new Error(`Doc data is invalid: ${dataPath}`);
}

//ModuleVariable, ModuleFunction, ModuleClass

const classes = [];
const functions = [];
const variables = [];

data.forEach((entry) =>
{
   switch(entry.kind)
   {
      case 'ModuleClass':
         classes.push(entry.name);
         break;
      case 'ModuleFunction':
         functions.push(entry.name);
         break;
      case 'ModuleVariable':
         variables.push(entry.name);
         break;
   }
});

classes.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
functions.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
variables.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

const filePath = `.${path.sep}${process.env.TARGET}.js`;

let output = `// Global classes, functions, variables defined in commons module & foundry.js (${process.env.TARGET}).
module.exports = {
  "globals": {
    // Other
    "Handlebars": "readonly",
    "HandlebarsIntl": "readonly",\r\n`

// Hand entry of commons module data.
output +=`
    // Commons module Classes
    "Collection": "readonly",
    "Semaphore": "readonly",

    // Commons module Functions
    "benchmark": "readonly",
    "colorStringToHex": "readonly",
    "debounce": "readonly",
    "deepClone": "readonly",
    "diffObject": "readonly",
    "duplicate": "readonly",
    "encodeURL": "readonly",
    "expandObject": "readonly",
    "filterObject": "readonly",
    "flattenObject": "readonly",
    "getParentClasses": "readonly",
    "getProperty": "readonly",
    "getRoute": "readonly",
    "getType": "readonly",
    "hasProperty": "readonly",
    "hexToRGB": "readonly",
    "hexToRGBAString": "readonly",
    "hsvToRgb": "readonly",
    "invertObject": "readonly",
    "isNewerVersion": "readonly",
    "isObjectEmpty": "readonly",
    "mergeObject": "readonly",
    "randomID": "readonly",
    "rgbToHex": "readonly",
    "rgbToHsv": "readonly",
    "setProperty": "readonly",
    "timeSince": "readonly",

    // Commons module Variables
    "foundry": "readonly",
    "CONST": "readonly",\r\n`;

output += `\r\n    // Foundry.js Classes\r\n`;

classes.forEach((entry) =>
{
   output += `    "${entry}": "readonly",\r\n`;
})

output += `\r\n    // Foundry.js Functions\r\n`;

functions.forEach((entry) =>
{
   output += `    "${entry}": "readonly",\r\n`;
})

output += `\r\n    // Foundry.js Variables\r\n`;

variables.forEach((entry, index, array) =>
{
   // Do not insert a comma for the last index in the array.
   output += `    "${entry}": "readonly"${index === array.length - 1 ? '' : ','}\r\n`;
})

output +=
`  }
}`;

fs.writeFileSync(filePath, output, 'utf8');
