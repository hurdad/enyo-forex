enyo.kind({
	name: 'Chart',
	kind: 'Control',
	published: {
		stockchart : null
	},
	events: {
		
	},
	components: [
		{name: 'chart', classes: 'enyo-highstock', onresize:"resizeHandler"}
	],
	constructor: function() {
		this.inherited(arguments);
		this.ta_array =[];
		this.secondary_axis_count = 0;
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
		  	title: {
				text: 'EUR/USD'
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
		  			id: 'axis-pair',
		  			title: {
		  				text: 'Price'
		  			}, 
		  			height: 250,
		  			lineWidth: 2
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
	resizeHandler:function(source, event) {
       
		//resize chart if exist
        if(source.name == "chart" && this.stockchart != null) 
       		this.stockchart.setSize($('#' + this.$.chart.id).width(), $('#' + this.$.chart.id).height(), false);
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
				M: 60 * 60 * 24 * 30,
			};

			var sec = to_seconds_factor[ts_duration];
			min = max - (300 * 9 * sec * ts_len * 1000);
		}else {

			//Min for auto nav is alld ata
			min = Date.UTC(2011,01,01);
		}

		//save
 		this.ts_len = ts_len;
 		this.ts_duration = ts_duration;

 		if(this.stockchart != null){
  			this.stockchart.showLoading('Loading data from server...');
  			if(ts_len != "auto")
  				this.stockchart.setTitle({text: pair}, {text: ts_len + ts_duration + " candlesticks"});
  			else
  				this.stockchart.setTitle({text: pair}, {text: ""});
  		}
	
 		var pair_request = new enyo.JsonpRequest({
	        url: "http://75.80.174.85/doo-forex/ohlc",
	        callbackName: "callback",
	        min: min,
	        max: max
	    });

 		pair_request.response(enyo.bind(this, "processPairData"));
 		
 		//update pair
		if(ts_len == "auto"){
			this.drilldown = true;
 			pair_request.go({ pair: pair, start: min, end: max });
		}else{
			this.drilldown = false;
			pair_request.go({ pair: pair, start: min, end: max, timeslice: ts_len + ts_duration });
		}

		//update tas
		for (var i = 0; i < this.ta_array.length; i++) {

			var ta_request = new enyo.JsonpRequest({
				url: "http://10.10.0.11/doo-forex/ta",
				callbackName: "callback",
				function: this.ta_array[i]
			});

			ta_request.response(enyo.bind(this, "processTechnicalIndicatorData"));
    		
    		if(!this.drilldown)
		    	ta_request.go({ pair: this.pair, function: this.ta_array[i], start: min, end: max, timeslice: this.ts_len + this.ts_duration });
		    else
		    	ta_request.go({ pair: this.pair, function: this.ta_array[i], start: min, end: max});

		}
	},

	processPairData: function(inRequest, inResponse) {

    	if (!inResponse) return;      	

      	//set data
      	this.stockchart.get('series-pair').setData(inResponse);
      	this.stockchart.get('series-nav').setData(inResponse);
		
      	if(!this.drilldown){
      		var range = inRequest.max - inRequest.min;

      		this.stockchart.xAxis[0].setExtremes(inRequest.max - (range * .1), inRequest.max);
      	}else{
      		this.stockchart.xAxis[0].setExtremes(inRequest.min, inRequest.max);
      	}

      	this.min = inRequest.min;
      	this.max = inRequest.max;

      	this.stockchart.hideLoading();
	},

	showTechnicalIndicator: function(e) {

		//check for toggle
		if(e.enabled){
			
			this.ta_array.push(e.function_name);

			var start, end;

			if(this.drilldown){
				//use current nav window as time
				var b = this.stockchart.xAxis[0].getExtremes();
				start = Math.round(b.min);
				end = Math.round(b.max);
			}else{

				start = this.min;
				end = this.max;
			}

		    //add new series
		    if(e.function_name != "EMA" && e.function_name != "SMA" ){

		    	this.secondary_axis_count++;
		    	var top = 185 + (this.secondary_axis_count * 120);
	
		        this.stockchart.addAxis({ // Secondary yAxis
		            id: 'axis-' + e.function_name,
		            title: {
		                text:  e.function_name
		            },
		            top: top,
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
		            id: 'series-' + e.function_name,
		            name: e.function_name,
		            type: 'line',
		           	dataGrouping: {
						enabled: false
					},
		            yAxis: 'axis-' + e.function_name,
		        });

		        this.stockchart.setSize($('#' + this.$.chart.id).width(), top + 200, false);
		    }else{
		    	
		    	this.stockchart.addSeries({
		    		id: 'series-' + e.function_name,
		    		name: e.function_name,
		    		type: 'line',
		    		dataGrouping: {
						enabled: false
					},
		            yAxis: 'axis-pair'
		        });
		    }

		    var request = new enyo.JsonpRequest({
				url: "http://10.10.0.11/doo-forex/ta",
				callbackName: "callback",
				function: e.function_name
			});

		    request.response(enyo.bind(this, "processTechnicalIndicatorData"));

		    console.log(enyo.json.stringify(e.param));

		    if(!this.drilldown)
		    	request.go({ pair: this.pair, function: e.function_name, function_param_arr: enyo.json.stringify(e.param), start: start, end: end, timeslice: this.ts_len + this.ts_duration });
		    else
		    	request.go({ pair: this.pair, function: e.function_name, function_param_arr: enyo.json.stringify(e.param), start: start, end: end});

		}else{

 			if(e.function_name != "EMA" && e.function_name != "SMA" )
				this.secondary_axis_count--;
			this.ta_array = this.removeA(this.ta_array, e.function_name);

			//remove series
			this.stockchart.get('series-' + e.function_name).remove();

			//remove axis
			if(e.function_name != "EMA" && e.function_name != "SMA" ){
            	this.stockchart.get('axis-' + e.function_name).remove();    

				var top = 185 + (this.secondary_axis_count * 120);
	          	this.stockchart.setSize($('#' + this.$.chart.id).width(), top + 200, false);
	        }
		}

	
	},

	processTechnicalIndicatorData: function(inRequest, inResponse) {

		if (!inResponse) return;     

		ta = [],
		dataLength = inResponse.length;
			
		for (i = 0; i < dataLength; i++) {
			ta.push([
				inResponse[i][0], // the date
				inResponse[i][1], // val
			]);
		}

	
		this.stockchart.get('series-' + inRequest.function).setData(ta);

	},

    afterSetExtremes: function(e) {
    	
    	if(!this.drilldown) return;


 		this.stockchart.showLoading('Loading data from server...');


    	//Series Data
		var request = new enyo.JsonpRequest({
			url: "http://75.80.174.85/doo-forex/ohlc",
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

		this.stockchart.hideLoading();
    	
    },
    removeA: function(arr) {
	    var what, a = arguments, L = a.length, ax;
	    while (L > 1 && arr.length) {
	        what = a[--L];
	        while ((ax= arr.indexOf(what)) !== -1) {
	            arr.splice(ax, 1);
	        }
    	}
    	return arr;
    }
});