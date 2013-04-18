enyo.kind({
	name: "MACD",
	published: {
		param1: 12,
		param2: 26,
		label: "MACD"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "MACD",
		series:[{
			name: "MACD", 
			chart_type: "line", 
			output_index: 1
		}],
		yAxis:{}
	},
	components:[
		{name: "toggle", kind: "onyx.ToggleButton", onChange: "toggleChangedHandler", classes: "labeled-item-icon"},
		{name: "label"},
		{name: "picker2", kind: "ParamPicker", onValueChanged: "valueChanged"},
		{name: "picker1", kind: "ParamPicker", onValueChanged: "valueChanged"}
	],
	rendered: function(){
		this.inherited(arguments); 
		this.$.label.setContent(this.label);
		
		//param1
		this.$.picker1.setValue(this.param1);
		this.$.picker1.updateValue();

		//param2
		this.$.picker2.setValue(this.param2);
		this.$.picker2.updateValue();
	},
	toggleChangedHandler: function(inSender) { 
		this.doToggleChanged({enabled: inSender.value, config: this.config, params:[this.$.picker1.getValue(), this.$.picker2.getValue()]});
	},
	valueChanged: function(inSender, inEvent) {
		//disable
		this.$.toggle.setValue(false);
		this.doToggleChanged({enabled: false, config: this.config, params:[this.$.picker1.getValue(), this.$.picker2.getValue()]});
	}
});