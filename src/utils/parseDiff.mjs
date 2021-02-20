import parseDocData from './parseDocData.mjs';

export default function parseDiff(previousVersion, nextVersion)
{
   const previous = parseDocData(previousVersion);
   const next = parseDocData(nextVersion);

   const diff = (prevArray, nextArray) =>
   {
      const result = [];

      for (const entry of prevArray)
      {
         if (!nextArray.includes(entry))
         {
            result.push(entry);
         }
      }

      return result;
   }

   return {
      classes: diff(previous.all.classes, next.all.classes),
      functions: diff(previous.all.functions, next.all.functions),
      variables: diff(previous.all.variables, next.all.variables)
   };
}

