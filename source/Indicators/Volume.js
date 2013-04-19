enyo.kind({
	name: "VOL",
	published: {
		instance: 0,
		label: "Volume"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "VOL",
		series:[{
			name: "Volume", 
			chart_type: "column", 
			output_index: 1
		}],
		yAxis:[]
	},
	components:[
		{name: "toggle", kind: "onyx.ToggleButton", onChange: "toggleChangedHandler", classes: "labeled-item-icon"},
		{name: "label"}
	],
	rendered: function(){
		this.inherited(arguments); 
		this.$.label.setContent(this.label);
	},
	toggleChangedHandler: function(inSender) { 
		this.doToggleChanged({enabled: inSender.value, instance: this.instance, config: this.config});
	}
});