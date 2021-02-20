import parseDiff    from './utils/parseDiff.mjs';

/**
 * This script simply output a set of console log statements to use in Foundry to verify that the diff indeed is
 * correct.
 */

const diff = parseDiff(process.env.PREVIOUS, process.env.NEXT);

for (const key in diff)
{
   for (const entry of diff[key])
   {
      console.log(`console.log(\`diff test - ${entry}: \${typeof ${entry}}\${typeof ${entry} === 'undefined' ? '' : ' !!!!!'}\`);`);
   }
}
