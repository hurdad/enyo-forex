enyo.kind({
	name: "ROC",
	published: {
		instance: 0,
		label: "ROC"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "ROC",
		series:[{
			name: "ROC", 
			chart_type: "line", 
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
		this.doToggleChanged({enabled: inSender.value, instance: this.instance,config: this.config});
	}
});