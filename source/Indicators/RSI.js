enyo.kind({
	name: "RSI",
	published: {
		param1: 14,
		label: "RSI"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "RSI",
		series:[{
			name: "RSI", 
			chart_type: "line", 
			output_index: 1
		}],
		yAxis:{
			min:0, 
			max:100
		}
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
		this.doToggleChanged({enabled: inSender.value, config: this.config, params:[this.$.picker1.getValue()]});
	},
	valueChanged: function(inSender, inEvent) {
		//disable
		this.$.toggle.setValue(false);
		this.doToggleChanged({enabled: false, config: this.config, params:[this.$.picker1.getValue()]});
	}
});