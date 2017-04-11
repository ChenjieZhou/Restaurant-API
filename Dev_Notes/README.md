### 1. Configurate our package.json file and .babelrc
Install packages
```
npm install --save express mongoose body-parser
npm install --save-dev nodemon eslint babel-cli babel-core babel-eslint babel-preset-es2015 babel-preset-stage-0
```
nodemon: watch the change of code and restart

Add these scripts that we could use `npm run bulid` to build project or use `npm run lint` to check our code.
This is config for babelrc
```
"dev": "NODE_ENV=development nodemon -w src --exec \"babel-node src --presets es2015,stage-0\"",
"build": "babel src -s -D -d dist --presets es2015,stage-0",
"start": "NODE_ENV=production pm2 start dist",
"prestart": "npm run -s build",
"lint": "eslint src",
```
.babelrc
```
{
  "presets":[
    "es2015",
    "stage-0"
  ]
}
```
