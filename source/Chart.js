enyo.kind({
	name: 'Chart',
	kind: 'Control',
	published: {
		stockchart : null
	},
	events: {
		
	},
	constructor: function() {
		this.inherited(arguments);
	},
	components: [
		{name: 'chart', classes: 'enyo-highstock'}
	],
	rendered: function(){
		this.inherited(arguments); 
	},

	showPair: function(pair, timeslice) {

 		var request = new enyo.JsonpRequest({
	        url: "http://10.10.0.11/doo-forex/ohlc",
	        callbackName: "callback"
	    });

 		request.response(enyo.bind(this, "processResults"));


		var max = new Date().getTime();
		var min = max - (30 * 24 * 60 * 60 * 2 * 1000);


		if(timeslice == "auto")
 			request.go({ pair: pair, start: min, end: max });
		else
			request.go({ pair: pair, start: min, end: max, timeslice: timslice });


	

	},

	processResults: function(inRequest, inResponse) {

    	if (!inResponse) return;
	
		this.stockchart = new Highcharts.StockChart({
		  	chart: {
		  		renderTo: this.$.chart.hasNode(),
		  		type: 'candlestick',
		  		zoomType: 'x'
		  	},

		  	navigator: {
		  		adaptToUpdatedData: false,
		  		series: {
		  			data: inResponse
		  		}
		  	},

		  	title: {
		  
		  	},

		  	subtitle: {

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
		  		inputEnabled: true, // it supports only days
		  		selected: 4 // all
		  	},
			xAxis : {
				events : {
					afterSetExtremes : enyo.bind(this, "afterSetExtremes") 
				}
			},
		  	yAxis: [{
		  			title: {
		  				text: 'Price'
		  			}, height: 200
		  		}, {
		  			title: {
		  				text: 'Volume'
		  			},
		  			top: 300,
		  			height: 100,
		  			offset: 0
		  		}
		  	],

		  	series: [{
		  			name: 'EUR/USD',
		  			data: inResponse,
		  			dataGrouping: {
		  				enabled: false
		  			},
		  		}
		  	]
		});
	},


	toggleVolume: function() {
	
	},
	addTechincalIndicator: function(name) {
	
	},
	removeTechincalIndicator: function(name) {
	
	},



    afterSetExtremes: function(e) {
    	//console.log(e);
    	  var request = new enyo.JsonpRequest({
	        url: "http://10.10.0.11/doo-forex/ohlc",
	        callbackName: "callback"
	      });

	    request.response(enyo.bind(this, "processme"));
	    request.go({ pair: 'EUR/USD', start: Math.round(e.min), end: Math.round(e.max) });
	},

	processme: function(inRequest, inResponse) {

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


		this.stockchart.series[0].setData(ohlc);
		//this.stockchart.series[1].setData(volume);
		//	this.hideLoading();
    	
    }
});