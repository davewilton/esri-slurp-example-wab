/*global module:false*/
module.exports = function (grunt) {
  grunt.initConfig({
    // tell slurp which version of the JSAPI to get
    // and where to put it
    esri_slurp: {
      options: {
        version: '3.13'
      },
      dev: {
        options: {
          beautify: true
        },
        dest: 'src/esri'
      }
    },
    clean: {
      // clean the output directory before each build
      dist: ['dist'],
      // remove dojo source code (i.e. before fresh bower install)
      dojo: ['src/dgrid', 'src/dijit', 'src/dojo', 'src/dojox', 'src/put-selector', 'src/util', 'src/xstyle'],
      // remove esri source code (before slurp)
      esri: ['src/esri'],
      // remove uncompressed files from dist
      uncompressed: ['dist/**/*.uncompressed.js'],
      // remove console stripped files from dist
      stripped: ['dist/**/*.consoleStripped.js']
    },
	// dojo build configuration, mainly taken from dojo boilerplate
	execute: {
        dojoBuild: {
            // execute javascript files in a node child_process 
            src: ['src/arcgis-js-api/dojo/dojo.js'], // Path to dojo.js file in dojo source']
			cwd: './', // Directory to execute build within
			options: {
				args: [ 'load=build', '--profile', 'profiles\\app.profile.js', 'releaseDir=../dist']
				} 
        }
	},

    // this copies over index.html and replaces
    // the perl regexp section of build.sh in the dojo boilerplate
    'string-replace': {
      index: {
        src: './src/index.html',
        dest: './dist/index.html',
        options: {
          replacements: [
            // remove isDeubug
            {
              pattern: /isDebug: *true,/,
              replacement: ''
            },
            // strip js comments
            {
              pattern: /\s+\/\/.*$/gm,
              replacement: ''
            },
            // replace newlines w/ whitespace
            {
              pattern: /\n/g,
              replacement: ' '
            },
            // strip html comments
            {
              pattern: /<!--[\s\S]*?-->/g,
              replacement: ''
            },
            // collapse whitespace
            {
              pattern: /\s+/g,
              replacement: ' '
            }
          ]
        }
      }
    },
    // host files in a local web server
    connect: {
      options: {
        port: 9000,
        keepalive: true
      },
      // serve unbuilt application and samples
      src: {
        options: {
          base: ['src', 'samples']
        }
      },
      // serve unbuilt application and samples
      dist: {
        options: {
          base: ['dist', 'samples']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-esri-slurp');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('slurp', ['clean:esri', 'esri_slurp:dev']);
  grunt.registerTask('build', ['clean:dist', 'execute:dojoBuild', 'string-replace']);
};
