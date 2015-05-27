#esri-slurp-example-wab

#IN PROGRESS

The purpose of this repo is to show how to do a Dojo build with Esri JSAPI source code downloaded using [grunt-esri-slurp](https://www.npmjs.org/package/grunt-esri-slurp) along with a build profile which will work with a simple Web App Builder Application. The aim is not to modify the WAB source code at all.

##Instructions
You must have [Node.js](http://nodejs.org/), [Bower.io](http://bower.io/) and the [Grunt CLI](http://gruntjs.com/getting-started) prior to running the steps below.

Install Grunt tasks with npm:
```bash
npm install
```

Download Dojo and other dependencies with bower:
```bash
bower install
```

Download the AMD build of the ArcGIS API for JavaScript with [grunt-esri-slurp](https://www.npmjs.org/package/grunt-esri-slurp):
```bash
grunt slurp
```

To verify that all dependencies are in place, you can serve the unbuilt app with:
```bash
grunt connect:src
```
Then browse to `http://localhost:9000/` and verify that it works.

Finally, build the app:
```bash
grunt build
```

To verify that the build was successful, you can serve the built app with:
```bash
grunt connect:dist
```
Then browse to `http://localhost:9000/` and verify that it
 works. You can inspect the network traffic to verify that the build version of the app requests fewer and smaller scripts (see below).

##Comparing the Built App
In order to determine if our build improves the user experience, we need to verify that the built page makes fewer script requests and that the size of the scripts requested is smaller when compared to similar pages that reference the [standard and compact CDN hosted builds of the API](https://developers.arcgis.com/javascript/jshelp/inside_compactbuild.html). The "app" in this example is a simple web app builder application. It is included as the scr web app.

Each of the wigets has been built as individual layers. These could be added to the main dojo.js file to reduce the number of requests further. Due to the way the WAB is strucured using esri's basewidget it is not possible to 

Page | JS Requests | JS KB (gzipped) | JS KB (uncompressed)
------ | ----------------- | ------------- | --------------- | ---------------
src/index.html (source app) | 455 | ? |  3800 
dist/index.html (built app) | 16 |  619 | 1600 

However, **your mileage may vary and there are many factors to consider when deciding whether or not it is worth while to do a Dojo build.** If your code is small and/or does not reference a lot of modules that are not already included in one of the CDN builds, a local build may not help that much. Conversely, when creating applications with many modules, you should see significant improvements over the CDN builds in most cases.

## Reducing the Size (on Disk) of Build Output
By default the Dojo build outputs uncompressed versions of the source files as well as source maps to aid in debugging. If you don't need the source maps or uncompressed files (e.g. if you debug using the unbuilt source), then you can save time and space while running the build by uncommenting the following line in app.profile.js:
```js
// useSourceMaps: false
```

You can further reduce the size of the output directory by 50% or more by running the following grunt commands *after* the build:
```bash
grunt clean:uncompressed
grunt clean:stripped
```

##Resources
- [grunt-esri-slurp](https://www.npmjs.org/package/grunt-esri-slurp)
- [AGRC JavaScript Project Boilerplate](https://github.com/agrc/AGRCJavaScriptProjectBoilerPlate)
- [Dojo Boilerplate](https://github.com/csnover/dojo-boilerplate)
- [Dojo Build Tutorial](http://dojotoolkit.org/documentation/tutorials/1.9/build/)
- [Dojo Build Reference Guide](http://dojotoolkit.org/reference-guide/1.9/build/index.html)
- [ArcGIS API for JavaScript Compact Build](https://developers.arcgis.com/javascript/jshelp/inside_compactbuild.html)

##Credit

This repo is forked from [@Tomwayson](https://github.com/tomwayson/esri-slurp-example) slurp example which built upon the work of [@steveoh](https://github.com/steveoh) and [@stdavis](https://github.com/stdavis).
