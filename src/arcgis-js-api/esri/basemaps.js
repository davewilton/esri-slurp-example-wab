//>>built
define(["require", "dojo/has", "./kernel", "dojo/i18n!./nls/jsapi"], function(a, c, d, b) {
    a = a.toUrl(".");
    return {
        streets: {
            title: b.basemaps.streets,
            thumbnailUrl: a + "/images/basemap/streets.jpg",
            itemId: "d8855ee4d3d74413babfb0f41203b168",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
            }]
        },
        satellite: {
            title: b.basemaps.satellite,
            thumbnailUrl: a + "/images/basemap/satellite.jpg",
            itemId: "86de95d4e0244cba80f0fa2c9403a7b2",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
            }]
        },
        hybrid: {
            title: b.basemaps.hybrid,
            thumbnailUrl: a + "/images/basemap/hybrid.jpg",
            itemId: "413fd05bbd7342f5991d5ec96f4f8b18",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
            }, {
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
                isReference: !0
            }]
        },
        terrain: {
            title: b.basemaps.terrain,
            thumbnailUrl: a + "/images/basemap/terrain.jpg",
            itemId: "aab054ab883c4a4094c72e949566ad40",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer"
            }, {
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer",
                isReference: !0
            }]
        },
        topo: {
            title: b.basemaps.topo,
            thumbnailUrl: a + "/images/basemap/topo.jpg",
            itemId: "6e03e8c26aad4b9c92a87c1063ddb0e3",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
            }]
        },
        gray: {
            title: b.basemaps.gray,
            thumbnailUrl: a + "/images/basemap/gray.jpg",
            itemId: "8b3b470883a744aeb60e5fff0a319ce7",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer"
            }, {
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer",
                isReference: !0
            }]
        },
        "dark-gray": {
            title: b.basemaps["dark-gray"],
            thumbnailUrl: a + "/images/basemap/dark-gray.jpg",
            itemId: "da65bacab5bd4defb576f839b6b28098",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer"
            }, {
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer",
                isReference: !0
            }]
        },
        oceans: {
            title: b.basemaps.oceans,
            thumbnailUrl: a + "/images/basemap/oceans.jpg",
            itemId: "48b8cec7ebf04b5fbdcaf70d09daff21",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer"
            }, {
                url: "http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer",
                isReference: !0
            }]
        },
        "national-geographic": {
            title: b.basemaps["national-geographic"],
            thumbnailUrl: a + "/images/basemap/national-geographic.jpg",
            itemId: "509e2d6b034246d692a461724ae2d62c",
            baseMapLayers: [{
                url: "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer"
            }]
        },
        osm: {
            title: b.basemaps.osm,
            thumbnailUrl: a + "/images/basemap/osm.jpg",
            itemId: "5d2bfa736f8448b3a1708e1f6be23eed",
            baseMapLayers: [{
                type: "OpenStreetMap"
            }]
        }
    }
});