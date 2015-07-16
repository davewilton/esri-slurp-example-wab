/**
 * Look to `util/build/buildControlDefault.js` for more information on available options and their default values.
 */

var profile = {
  // `basePath` is relative to the directory containing this profile file; in this case, it is being set to the
  // src/ directory, which is the same place as the `baseUrl` directory in the loader configuration. (If you change
  // this, you will also need to update run.js.)
  basePath: '../src',

  // This is the directory within the release directory where built packages will be placed. The release directory
  // itself is defined by `build.sh`. You should probably not use this; it is a legacy option dating back to Dojo
  // 0.4.
  // If you do use this, you will need to update build.sh, too.
  // releaseName: '',

  // Builds a new release.
  action: 'release',

  // Strips all comments and whitespace from CSS files and inlines @imports where possible.
  cssOptimize: 'comments',

  // Excludes tests, demos, and original template files from being included in the built version.
  mini: true,

  // Uses Closure Compiler as the JavaScript minifier. This can also be set to "shrinksafe" to use ShrinkSafe,
  // though ShrinkSafe is deprecated and not recommended.
  // This option defaults to "" (no compression) if not provided.
  optimize: 'closure',

  // We're building layers, so we need to set the minifier to use for those, too.
  // This defaults to "shrinksafe" if not provided.
  layerOptimize: 'closure',

  // A list of packages that will be built. The same packages defined in the loader should be defined here in the
  // build profile.
  packages: [
    // Using a string as a package is shorthand for `{ name: 'app', location: 'app' }`
	{ name: 'jimu', location: 'jimu.js', destLocation: 'jimu.js'},
	{ name: 'dgrid', location: 'arcgis-js-api/dgrid', destLocation: 'arcgis-js-api/dgrid'},
	{ name: 'dijit', location: 'arcgis-js-api/dijit', destLocation: 'arcgis-js-api/dijit'},
	{ name: 'dojo', location: 'arcgis-js-api/dojo', destLocation: 'arcgis-js-api/dojo'},
	{ name: 'dojox', location: 'arcgis-js-api/dojox', destLocation: 'arcgis-js-api/dojox'},
	{ name: 'esri', location: 'arcgis-js-api/esri', destLocation: 'arcgis-js-api/esri'},
	{ name: 'put-selector', location: 'arcgis-js-api/put-selector', destLocation: 'arcgis-js-api/put-selector'},
	{ name: 'xstyle', location: 'arcgis-js-api/xstyle', destLocation: 'arcgis-js-api/xstyle'},
	'widgets',
	'themes',
	'libs',
	'dynamic-modules',
	'configs'
  ],

  // Build source map files to aid in debugging.
  // This defaults to true.
  // useSourceMaps: false,

  // Strips all calls to console functions within the code. You can also set this to "warn" to strip everything
  // but console.error, and any other truthy value to strip everything but console.warn and console.error.
  // This defaults to "normal" (strip all but warn and error) if not provided.
  stripConsole: 'all',

  // The default selector engine is not included by default in a dojo.js build in order to make mobile builds
  // smaller. We add it back here to avoid that extra HTTP request. There is also an "acme" selector available; if
  // you use that, you will need to set the `selectorEngine` property in index.html, too.
  selectorEngine: 'lite',

  // Any module in an application can be converted into a "layer" module, which consists of the original module +
  // additional dependencies built into the same file. Using layers allows applications to reduce the number of HTTP
  // requests by combining all JavaScript into a single file.
  layers: {
    // This is the main loader module. It is a little special because it is treated like an AMD module even though
    // it is actually just plain JavaScript. There is some extra magic in the build system specifically for this
    // module ID.
    'dojo/dojo': {
      // By default, the build system will try to include `dojo/main` in the built `dojo/dojo` layer, which adds
      // a bunch of stuff we do not want or need. We want the initial script load to be as small and quick to
      // load as possible, so we configure it as a custom, bootable base.
      boot: true,
      customBase: true,
      include: [
     
          // dpendencies of esri/map/wab that will be requested if not included
        // probably in a nested require block or something the build script can't resolve
        'dojox/gfx/path',
        'dojox/gfx/svg',
        'dojox/gfx/shape',
        'esri/dijit/Attribution',
		"dojo/NodeList-manipulate",
		"esri/SnappingManager",
		"xstyle/load-css",

		
		//all of the layer types are loaded in the map by default
		"esri/layers/ArcGISDynamicMapServiceLayer", 'esri/layers/FeatureLayer', "esri/layers/ArcGISImageServiceLayer", "esri/layers/ArcGISImageServiceVectorLayer", "esri/layers/CSVLayer", "esri/layers/DataSource", "esri/layers/DimensionalDefinition",
		"esri/layers/DynamicLayerInfo", "esri/layers/DynamicMapServiceLayer", "esri/layers/GeoRSSLayer", "esri/layers/ImageParameters", "esri/layers/ImageServiceParameters", "esri/layers/KMLFolder", "esri/layers/KMLGroundOverlay", "esri/layers/KMLLayer",
		"esri/layers/LayerDrawingOptions", "esri/layers/PurgeOptions", "esri/layers/WMSLayer", "esri/layers/WMSLayerInfo", "esri/layers/WebTiledLayer", "esri/layers/StreamTrackManager", "esri/layers/StreamLayer",
		//Layer infos these are all embeded as a dynamic require within the layerInfoFactory
		"jimu/LayerInfos/LayerInfo", "jimu/LayerInfos/LayerInfos", "jimu/LayerInfos/LayerInfoForCollection", "jimu/LayerInfos/LayerInfoForDefault", "jimu/LayerInfos/LayerInfoForDefaultDynamic", "jimu/LayerInfos/LayerInfoForDefaultImage",
		"jimu/LayerInfos/LayerInfoForDefaultService", "jimu/LayerInfos/LayerInfoForDefaultTable", "jimu/LayerInfos/LayerInfoForDefaultTile", "jimu/LayerInfos/LayerInfoForDefaultWMS", "jimu/LayerInfos/LayerInfoForGeoRSS", "jimu/LayerInfos/LayerInfoForGroup",
		"jimu/LayerInfos/LayerInfoForKML", "jimu/LayerInfos/LayerInfoForMapService", "jimu/LayerInfos/LayerInfoForWMS",
		
		//other WAB items which appea to be dynamic/nested
		"jimu/PoolControllerMixin",  "jimu/dijit/ViewStack",
		
		//these are all of the layers we want embedded into the main dojo layer.
		"widgets/main", //you must list all the widgets you are using within this file
		"jimu/main",
		"libs/main",
		"themes/FoldableTheme/main",
		
		//required by theme.
		"themes/FoldableTheme/widgets/HeaderController/Widget", "themes/FoldableTheme/widgets/HeaderController/PopupTileNodes"
      ],
      includeLocales: ['en-gb']
    }

  },

  // Providing hints to the build system allows code to be conditionally removed on a more granular level than simple
  // module dependencies can allow. This is especially useful for creating tiny mobile builds. Keep in mind that dead
  // code removal only happens in minifiers that support it! Currently, only Closure Compiler to the Dojo build system
  // with dead code removal. A documented list of has-flags in use within the toolkit can be found at
  // <http://dojotoolkit.org/reference-guide/dojo/has.html>.
  staticHasFeatures: {
    // The trace & log APIs are used for debugging the loader, so we do not need them in the build.
    'dojo-trace-api': false,
    'dojo-log-api': false,

    // This causes normally private loader data to be exposed for debugging. In a release build, we do not need
    // that either.
    'dojo-publish-privates': false,

    // This application is pure AMD, so get rid of the legacy loader.
    'dojo-sync-loader': false,

    // `dojo-xhr-factory` relies on `dojo-sync-loader`, which we have removed.
    'dojo-xhr-factory': false,

    // We are not loading tests in production, so we can get rid of some test sniffing code.
    'dojo-test-sniff': false
  }
};
