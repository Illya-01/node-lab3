/** @type {import("prettier").Config} */
const config = {
   arrowParens: 'avoid',
   bracketSameLine: true,
   trailingComma: 'es5',
   tabWidth: 3,
   semi: false,
   singleQuote: true,
   printWidth: 80,

   overrides: [
      {
         files: ['*.json', '*.yaml'],
         options: {
            tabWidth: 2,
         },
      },
   ],
}

export default config
