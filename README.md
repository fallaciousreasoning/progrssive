Progrssive is a Progressive Web App for reading RSS feeds (hence the name: ProgRSSive). It's built in such a way that it works entirely offline.

A live version is available at https://readr.nz

![Progrssive installed as a PWA on desktop](https://github.com/fallaciousreasoning/progrssive/raw/master/images/desktop-installed-stream.png)

## Installing
Currently not all browsers support installing PWAs. I've collected some of the ones that do here:

- [Firefox](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen) - Android only, last I checked
- [Chrome](https://support.google.com/chrome/answer/9658361)
- [Edge](https://www.ghacks.net/2020/03/02/how-to-install-progressive-web-apps-pwas-in-the-new-microsoft-edge/)
- Safari - Disclaimer: I've never tested this on Safari, so it's highly likely it won't work.

## Developing

1. Clone the repository
   
       git clone https://github.com/fallaciousreasoning/progrssive.git

2. Install packages

        npm i

3. Start the development server.

        npm run start
    by default, Progrssive will be available on http://localhost:8080

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
