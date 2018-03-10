$(document).ready(
    function(){
        $("a#show_map").click(function(){
                $("#map").modal({
                        minHeight: 480,
                        minWidth: 640,
                        resizable: false,
                        draggable: false,
                        resizeOnLoad: true,
                        onOpen: init,
                        onClose: function() { },
                        buttons: {'پایان': function(modal) { modal.closeModal(); }}
                });
        });


    }
);
var geojson_format = new OpenLayers.Format.GeoJSON();
var map, json_layer, myStyles;

function featureMaker(points)
{
    var feature = {
        "type": "FeatureCollection", 
        "features": [
            {"geometry": {
                    "type": "GeometryCollection", 
                    "geometries": []
                }, 
                "type": "Feature", 
                "properties": {"colorFill" : "#000000"}}
        ]
    }
    $(points).each(function(i, item){
            var toAdd = {"type":"Point", "coordinates":[item.lon, item.lat]};
            feature.features[0].geometry.geometries.push(toAdd);
    });

    return feature;
}

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            ); 
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
            );
        }, 

        trigger: function(e) {
            var lonlat = map.getLonLatFromPixel(e.xy);
            var data = [];
            data[0] = lonlat;
            var featureCol = featureMaker(data);
            json_layer.removeAllFeatures();
            json_layer.addFeatures(geojson_format.read(featureCol));

            $('#map_long').val(lonlat.lon);
            $('#map_lat').val(lonlat.lat);
        }

});

function init() {
    var oms = new OpenLayers.Layer.XYZ(
        "MyOMS",
        [
            "http://localhost/map/oms/${z}/${x}/${y}.png"
        ], {
            transitionEffect: "resize",
            numZoomLevels: 10
        }
    );
    
    myStyles = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                    fillColor: "#ff7800",
                    circle:20})
    });

    json_layer = new OpenLayers.Layer.Vector("GEOJson");
    //, {styleMap: myStyles}); 

    map = new OpenLayers.Map( {
            div: "map",
            maxExtent: [ 50.57378, 39.51788, 50.63590, 39.56445 ],
            layers: [oms, json_layer],
            controls: [
                new OpenLayers.Control.Navigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                }),
                new OpenLayers.Control.Zoom(),
                new OpenLayers.Control.Permalink({anchor: true}),
                new OpenLayers.Control.MousePosition()
            ],
            center: [50.606215, 39.536165],
            zoom: 2
    } );

    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
}