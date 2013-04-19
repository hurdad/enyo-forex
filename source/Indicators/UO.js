enyo.kind({
	name: "UO",
	published: {
		instance: 0, 
		param1: 7,
		param2: 14,
		param3: 28,
		label: "UO"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "UO",
		series:[{
			name: "Ultimate Oscillator", 
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
		{name: "picker3", kind: "ParamPicker", onValueChanged: "valueChanged"},
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

		//param3
		this.$.picker3.setValue(this.param3);
		this.$.picker3.updateValue();
	},
	toggleChangedHandler: function(inSender) { 
		this.doToggleChanged({enabled: inSender.value, instance: this.instance, config: this.config, params:[this.$.picker1.getValue(), this.$.picker2.getValue(), this.$.picker3.getValue()]});
	},
	valueChanged: function(inSender, inEvent) {
		//disable
		this.$.toggle.setValue(false);
	}
});