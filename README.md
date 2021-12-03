Extreme Life
# Development
## Fresh install

From the root directory of this repository run:
```
rm package-lock.json
rm -rf node_modules/
npm install
npm audit fix --force
npm run build

```


## Start Server
From the root directory of this repository run: `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Current Routes
 * http://localhost:3000/
 * http://localhost:3000/game
