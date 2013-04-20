enyo.kind({
	name: 'Chart',
	kind: 'Control',
	published: {
		stockchart : null
	},
	events: {
		onTechnicalAnalysisUpdateCurrentValue: ""
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

		//render new stockchart
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
		  			height: 225,
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

			if(min < Date.UTC(2011,01,01))
				min = Date.UTC(2011,01,01);
		}else {

			//Min for auto nav is all data
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
	        pair: this.pair,
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

		//update ta's
		for (var i = 0; i < this.ta_array.length; i++) {

			var ta_request = new enyo.JsonpRequest({
				url: "http://75.80.174.85/doo-forex/ta",
				callbackName: "callback",
				function: this.ta_array[i].function,
				instance: this.ta_array[i].instance,
				series: this.ta_array[i].series,

			});

			ta_request.response(enyo.bind(this, "processTechnicalIndicatorData"));
    		
    		if(!this.drilldown)
		    	ta_request.go({ pair: this.pair, function: this.ta_array[i].function, function_param_arr: enyo.json.stringify(this.ta_array[i].params), start: min, end: max, timeslice: this.ts_len + this.ts_duration });
		    else
		    	ta_request.go({ pair: this.pair, function: this.ta_array[i].function, function_param_arr: enyo.json.stringify(this.ta_array[i].params), start: min, end: max});

		}
	},

	processPairData: function(inRequest, inResponse) {

    	if (!inResponse) return;      	

      	//set data
      	this.stockchart.get('series-pair').setData(inResponse);
      	this.stockchart.get('series-nav').setData(inResponse);

      	//set name
      	this.stockchart.get('series-pair').name = inRequest.pair;
		
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

		var top_offset = 200;

		//check for toggle
		if(e.enabled){
			
			this.ta_array.push({
				id: e.config.function + '-' + e.instance,
				function: e.config.function,
				instance: e.instance,
				series: e.config.series,
				params: e.params
			});

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
		    if(e.config.yAxis != null){
		  		//new axis
		    	this.secondary_axis_count++;
		    	var top = top_offset + (this.secondary_axis_count * 120);
	
		    	var axis = { // Secondary yAxis
		            id: 'axis-' + e.config.function,
		            title: {
		                text:  e.config.function
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
		        };

		        //merge
				jQuery.extend(axis, e.config.yAxis);
			
				//add
		        this.stockchart.addAxis(axis);

		        //loop series
		        for (var i = 0; i < e.config.series.length; i++) {
   					
			        this.stockchart.addSeries({
			            id: 'series-' + e.config.series[0].name + '-' + e.instance,
			            name: e.config.series[i].name,
			            type: e.config.series[i].chart_type,
			           	dataGrouping: {
							enabled: false
						},
			            yAxis: 'axis-' + e.config.function,
			        });

		    	}

		        this.stockchart.setSize($('#' + this.$.chart.id).width(), top + 200, false);
		    }else{//use pair axis
		    	
		    	//SMA or EMA
		    	this.stockchart.addSeries({
		    		id: 'series-' + e.config.series[0].name + '-' + e.instance,
		    		name: e.config.series[0].name + ' ' + e.params.join(','),
		    		type: e.config.series[0].chart_type,
		    		dataGrouping: {
						enabled: false
					},
		            yAxis: 'axis-pair'
		        });
		    }

		    var request = new enyo.JsonpRequest({
				url: "http://75.80.174.85/doo-forex/ta",
				callbackName: "callback",
				function: e.config.function,
				instance: e.instance,
				series: e.config.series
			});

		    request.response(enyo.bind(this, "processTechnicalIndicatorData"));

		    if(!this.drilldown)
		    	request.go({ pair: this.pair, function: e.config.function, function_param_arr: enyo.json.stringify(e.params), start: start, end: end, timeslice: this.ts_len + this.ts_duration });
		    else
		    	request.go({ pair: this.pair, function: e.config.function, function_param_arr: enyo.json.stringify(e.params), start: start, end: end});

		}else{//Remove Axis
 		
 			if(e.config.yAxis != null)
				this.secondary_axis_count--;

			//remove ta from array
			for (var i = 0; i < this.ta_array.length; i++){
				if(e.config.function + '-' + e.instance == this.ta_array[i].id)
					this.ta_array.remove(i);
			}

			//loop series
 			for (var i = 0; i < e.config.series.length; i++){
				//remove series
				this.stockchart.get('series-' + e.config.series[i].name + '-' + e.instance).remove();			
			}

			//remove axis
			if(e.config.yAxis != null){
            	this.stockchart.get('axis-' + e.config.function).remove();    

				var top = top_offset + (this.secondary_axis_count * 120);
	          	this.stockchart.setSize($('#' + this.$.chart.id).width(), top + 200, false);
	        }
		}	
	},

	processTechnicalIndicatorData: function(inRequest, inResponse) {

		if (!inResponse) return;     

		for (var i = 0; i < inRequest.series.length; i++){

			var ta = [];
			for (j = 0; j < inResponse.length; j++) {
				ta.push([
					inResponse[j][0], // the date
					inResponse[j][inRequest.series[i].output_index], // val
				]);

				//get last
				if(j == inResponse.length - 1)
					this.doTechnicalAnalysisUpdateCurrentValue({
						date: inResponse[j][0], // the date
						name: inRequest.series[i].name,
						instance: inRequest.instance,
						val: inResponse[j][inRequest.series[i].output_index], // val
					});
			}

			//set series ta data	
			this.stockchart.get('series-' + inRequest.series[i].name + '-' + inRequest.instance).setData(ta);
		
		}
	},

    afterSetExtremes: function(e) {
    	
    	if(!this.drilldown) return;

 		this.stockchart.showLoading('Loading data from server...');

    	//pair Series Data
		var request = new enyo.JsonpRequest({
			url: "http://75.80.174.85/doo-forex/ohlc",
			callbackName: "callback"
		});

	    request.response(enyo.bind(this, "processDrillData"));
	    request.go({ pair: this.pair, start: Math.round(e.min), end: Math.round(e.max) });


	    //update ta's
		for (var i = 0; i < this.ta_array.length; i++) {

			var ta_request = new enyo.JsonpRequest({
				url: "http://75.80.174.85/doo-forex/ta",
				callbackName: "callback",
				function: this.ta_array[i].function,
				instance: this.ta_array[i].instance,
				series: this.ta_array[i].series,

			});

			ta_request.response(enyo.bind(this, "processTechnicalIndicatorData"));	
		   	ta_request.go({ pair: this.pair, function: this.ta_array[i].function, function_param_arr: enyo.json.stringify(this.ta_array[i].params), start: Math.round(e.min), end: Math.round(e.max)});
		}
	},

	processDrillData: function(inRequest, inResponse) {

    	if (!inResponse) return;
    	
    	//set pair series data
		this.stockchart.get('series-pair').setData(inResponse);
		this.stockchart.hideLoading();
    }
});

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};