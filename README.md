# BBTest

This project was created to demonstrate how the use of `typeforce` (and most likely specifically the BigInt type) interfere with being able to successfully sign a transaction in the browser using a minifed Create React App. Use the `BbtConfig.js` file to enable/disable the use of the typeforce where it impacts the signing process.

To reproduce the issue, perform the following steps assuming all dependencies have been installed and you have npx to act as content server:
* Run `npm run build` to create production version
* Run `npx serve -s build` to host production version locally
* Navigate to http://localhost:5000 and open Console page in Dev Tools - you should see a bunch of log messages that end up with an exception with an error trace like `"Error: Expected property "1" of type BigInteger, got n
    at a (http://localhost:5000/static/js/2.1ac6512d.chunk.js:1:197169)
    at tfSubError (http://localhost:5000/static/js/2.1ac6512d.chunk.js:1:198347)
    at http://localhost:5000/static/js/2.1ac6512d.chunk.js:1:22914
    at Array.every (<anonymous>)
    at t (http://localhost:5000/static/js/2.1ac6512d.chunk.js:1:22855)
    at h (http://localhost:5000/static/js/2.1ac6512d.chunk.js:1:23411)
    at Object.sign (http://localhost:5000/static/js/main.03369be5.chunk.js:1:2513)
    at l.sign (http://localhost:5000/static/js/main.03369be5.chunk.js:1:1998)
    at http://localhost:5000/static/js/2.1ac6512d.chunk.js:1:582734
    at Array.some (<anonymous>)"`
* change value of `_typeforceEnabled` to `false` in `BbtConfig.js` and rerun `npm run build`
* Run `npx serve -s build` to host production version locally
* Navigate to http://localhost:5000 and open Console page in Dev Tools - you should see the output of a fully signed transaction

As a side note, in the past, I've been able to get a CRA to build/run successfully after running `npm run eject` as described here: https://gitlab.com/bch-dev/op-wallet.


## CRA Boilerplate (not relevant to test)
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
