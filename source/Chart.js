enyo.kind({
	name: 'Chart',
	kind: 'Control',
	published: {
		stockchart : null
	},
	events: {
		
	},
	components: [
		{name: 'chart', classes: 'enyo-highstock'}
	],
	constructor: function() {
		this.inherited(arguments);
	},
	 destroy: function() {
        this.stockchart.destroy();
        this.inherited(arguments);
    },
	rendered: function(){
		this.inherited(arguments); 

		//redner new stockchart
		this.stockchart = new Highcharts.StockChart({
		  	chart: {
		  		renderTo: this.$.chart.hasNode(),
		  		type: 'candlestick',
		  		zoomType: 'x'
		  	},
		  	navigator: {
		  		adaptToUpdatedData: false,
		  		series: {
                    id: 'series-nav'
                }
		  	},
		  	rangeSelector: {
		  		buttons: [{
		  				type: 'minute',
		  				count: 1,
		  				text: '1m'
		  			}, {
		  				type: 'minute',
		  				count: 60,
		  				text: '1h'
		  			}, {
		  				type: 'day',
		  				count: 1,
		  				text: '1d'
		  			}, {
		  				type: 'day',
		  				count: 17,
		  				text: '1w'
		  			}, {
		  				type: 'month',
		  				count: 1,
		  				text: '1m'
		  			}, {
		  				type: 'year',
		  				count: 1,
		  				text: '1y'
		  			}, {
		  				type: 'all',
		  				text: 'All'
		  			}
		  		],
		  		inputEnabled: true // it supports only days
		  	},
			xAxis : {
				events : {
					afterSetExtremes : enyo.bind(this, "afterSetExtremes") 
				}
			},
		  	yAxis: [{
		  			title: {
		  				text: 'Price'
		  			}, height: 250
		  		}
		  	],
		  	series: [{
		  			id: 'series-pair',
		  			dataGrouping: {
		  				enabled: false
		  			},
		  		}
		  	]
		});
	},

	showPair: function(pair, ts_len, ts_duration) {

		var min, max;

		//save
		this.pair = pair;

		//max is live
		max = new Date().getTime();

		//calc min for timeslice
		if(ts_len != "auto"){
			var to_seconds_factor = {
				s: 1,
				m: 60,
				h: 60 * 60,
				d: 60 * 60 * 24,
				w: 60 * 60 * 24 * 7,
				M: 2629740
			};

			var sec = to_seconds_factor[ts_duration];
			min = max - (300 * 8 * sec);
		}else {

			//Min for auto nav is alld ata
			min = Date.UTC(2011,01,01);
		}
	
 		var request = new enyo.JsonpRequest({
	        url: "http://10.10.0.11/doo-forex/ohlc",
	        callbackName: "callback"
	    });

 		request.response(enyo.bind(this, "processPairData"));

		if(ts_len == "auto"){
 			request.go({ pair: pair, start: min, end: max });
 			this.drilldown = true;
		}else{
			request.go({ pair: pair, start: min, end: max, timeslice: ts_len + ts_duration });
			this.drilldown = false;
		}
	},

	processPairData: function(inRequest, inResponse) {

    	if (!inResponse) return;      	

      	//set data
      	this.stockchart.get('series-pair').setData(inResponse);
      	this.stockchart.get('series-nav').setData(inResponse);
	},

	showTechnicalIndicator: function(e) {


		if(e.enabled){

			var request = new enyo.JsonpRequest({
				url: "http://10.10.0.11/doo-forex/ta",
				callbackName: "callback",
				function: e.function_name
			});

		    request.response(enyo.bind(this, "processDrillData"));
		    request.go({ pair: this.pair, function: e.function_name, start: Math.round(e.min), end: Math.round(e.max) });

	        this.stockchart.addAxis({ // Secondary yAxis
	            id: 'axis-' + e.function_name,
	            title: {
	                text: 'Volume2'
	            },
	            top: 450,
	            height: 100,
	            offset: 0,
	            lineWidth: 2,
	            labels: {
	                align: 'left',
	                x: 0,
	                y: -2
	                }
	        });

	        this.stockchart.addSeries({
	            name: 'series-' + e.function_name,
	            type: 'column',
	            yAxis: 'axis-' + e.function_name,
	            data: volume,       
	        });

 			//chart.setSize($('#container').width(), 650, false);

		}else{

			this.stockchart.get('series-' + e.function_name).remove();
            this.stockchart.get('axis-' + e.function_name).remove();           
            //this.stockchart.setSize($('#container').width(), 500, false);
		}
	
	},

	processTechnicalIndicatorData: function(inRequest, inResponse) {

		if (!inResponse) return;     

		console.log(inRequest); 

		//set data
      //	this.stockchart.get('series-pair').setData(inResponse);

	},

    afterSetExtremes: function(e) {
    	
    	if(!this.drilldown) return;

    	//Series Data
		var request = new enyo.JsonpRequest({
			url: "http://10.10.0.11/doo-forex/ohlc",
			callbackName: "callback"
		});

	    request.response(enyo.bind(this, "processDrillData"));
	    request.go({ pair: this.pair, start: Math.round(e.min), end: Math.round(e.max) });
	},

	processDrillData: function(inRequest, inResponse) {

    	if (!inResponse) return;
    	
		// split the data set into ohlc and volume
		var ohlc = [],
		volume = [],
		dataLength = inResponse.length;
			
		for (i = 0; i < dataLength; i++) {
			ohlc.push([
				inResponse[i][0], // the date
				inResponse[i][1], // open
				inResponse[i][2], // high
				inResponse[i][3], // low
				inResponse[i][4] // close
			]);
			
			volume.push([
				inResponse[i][0], // the date
				inResponse[i][5] // the volume
			])
		}

		this.stockchart.get('series-pair').setData(ohlc);
    	
    }
});