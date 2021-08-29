import fs   from 'fs';
import path from 'path';

const s_SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Parses the TJSDoc raw docData in the given version for all ModuleClass, ModuleFunction, and ModuleDeclaration entries
 * which form the global script scope data for `foundry.js`. Please note there are some manual globalThis and window
 * setting which are added manually.
 *
 * The commonModule.json file is currently built by hand as well including global scope output.
 *
 * @param {string} version - semantic version string.
 *
 * @returns {{all: {variables: *[], functions: *[], classes: *[]}, foundry: {variables: [], functions: [], classes: []}, common: {variables: [], functions: [], classes: []}}}
 */
export default function parseDocData(version)
{
   const docDataPath = `.${path.sep}data${path.sep}${version}${path.sep}docData.json`;
   const commonDataPath = `.${path.sep}data${path.sep}${version}${path.sep}commonModule.json`;

   const match = s_SEMVER_REGEX.exec(version);
   if (match === null)
   {
      throw new Error(`Could not parse semver for version: ${version}`);
   }

   // Create float representation of major / minor version number.
   const versionFloat = Number.parseFloat(`${match[1]}.${match[2]}`);

   // Sanity check to make sure parent directory of DEPLOY_PATH exists.
   if (!fs.existsSync(docDataPath))
   {
      throw new Error(`Doc data path does not exist: ${docDataPath}`);
   }

   const docData = JSON.parse(fs.readFileSync(docDataPath, 'utf8'));

   if (!(docData instanceof Array))
   {
      throw new Error(`Doc data is invalid: ${docDataPath}`);
   }

   let common = {
      classes: [],
      functions: [],
      variables: []
   };

   try
   {
      common = JSON.parse(fs.readFileSync(commonDataPath, 'utf8'));
   }
   catch (err) { /**/ }

   const foundry = {
      classes: [],
      functions: [],
      variables: []
   }

   /**
    * Ensure that
    * @param array
    * @param name
    */
   const uniqueName = (array, name) =>
   {
      if (!array.includes(name))
      {
         array.push(name);
      }
   }

   docData.forEach((entry) =>
   {
      switch(entry.kind)
      {
         case 'ModuleClass':
            uniqueName(foundry.classes, entry.name);
            break;
         case 'ModuleFunction':
            uniqueName(foundry.functions, entry.name);
            break;
         case 'ModuleVariable':
            uniqueName(foundry.variables, entry.name);
            break;
      }
   });

   // TODO: Note manual insertion of a few foundry.js 0.8.0 variables applied directly to `globalThis` or `window`.
   // In particular this is accurate for Foundry 0.8.9
   if (versionFloat >= 0.8)
   {
      uniqueName(foundry.variables, 'canvas');     // line 4097 globalThis.canvas set in Game->constructor
      uniqueName(foundry.variables, 'FEATURES');   // line 32 window.FEATURES set
      uniqueName(foundry.variables, 'game');       // line 3 globalThis.game set
      uniqueName(foundry.variables, 'keyboard');   // line 4551 window.keyboard set in `Game.initializeKeyboard`
      uniqueName(foundry.variables, 'logger');     // line 25 globalThis.logger set
      uniqueName(foundry.variables, 'socket');     // line 4 globalThis.socket set
      uniqueName(foundry.variables, '_token');     // line 46211 "secret global" "let _token = null" set
      uniqueName(foundry.variables, 'ui');         // line 20 globalThis.ui set
      uniqueName(foundry.variables, 'vtt');        // line 2 globalThis.vtt set
   }

   foundry.classes.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
   foundry.functions.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
   foundry.variables.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

   const all = {
      classes: Array.from(new Set([...common.classes, ...foundry.classes])),
      functions: Array.from(new Set([...common.functions, ...foundry.functions])),
      variables: Array.from(new Set([...common.variables, ...foundry.variables]))
   }

   all.classes.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
   all.functions.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
   all.variables.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

   return {
      all,
      common,
      foundry
   }
}
