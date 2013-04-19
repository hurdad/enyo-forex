enyo.kind({
	name: "ADX",
	published: {
		instance : 0,
		param1: 14,
		label: "ADX"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "ADX",
		series:[{
			name: "ADX", 
			chart_type: "line", 
			output_index: 1
		}],
		yAxis:{}
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
	}
});