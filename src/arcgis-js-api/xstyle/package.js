var miniExcludes = {
		"xstyle/index.html": 1,
		"xstyle/README.md": 1,
		"xstyle/package": 1
	},
	isTestRe = /\/test\//;

var profile = {
	resourceTags: {
		test: function(filename, mid){
			return isTestRe.test(filename);
		},

		miniExclude: function(filename, mid){
			return isTestRe.test(filename) || mid in miniExcludes;
		},

		amd: function(filename, mid){
			return /\.js$/.test(filename);
		},
		copyOnly: function(filename, mid){
			return /build/.test(filename) || /xstyle\.min/.test(filename) || /amdLoader/.test(filename) || /core\/put/.test(filename);
		}
	}
};