enyo.kind({
	name: "EMA",
	published: {
		instance: null,
		param1: 20,
		label: "Exponential"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "EMA",
		series:[{
			name: "EMA", 
			chart_type: "line", 
			output_index: 1
		}],
		yAxis: null
	},
	components:[
		{name: "toggle", kind: "onyx.ToggleButton", onChange: "toggleChangedHandler", classes: "labeled-item-icon"},
		{name: "label"},
		{name: "picker1", kind: "ParamPicker", onValueChanged: "valueChanged"}
	],
	rendered: function(){
		this.inherited(arguments); 
		this.$.label.setContent(this.label);

		//param1
		this.$.picker1.setValue(this.param1);
		this.$.picker1.updateValue();
	},
	toggleChangedHandler: function(inSender) { 
		this.doToggleChanged({enabled: inSender.value, instance: this.instance, config: this.config, params:[this.$.picker1.getValue()]});
	},
	valueChanged: function(inSender, inEvent) {
		//disable
		this.$.toggle.setValue(false);
		this.doToggleChanged({enabled: false, instance: this.instance, config: this.config, params:[this.$.picker1.getValue()]});
	}
});