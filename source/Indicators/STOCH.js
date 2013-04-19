enyo.kind({
	name: "STOCH",
	published: {
		instance: 0,
		param1: 9,
		param2: 6,
		label: "STOCH"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "STOCH",
		series:[{
			name: "STOCH", 
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
		this.doToggleChanged({enabled: inSender.value, instance: this.instance, config: this.config, params:[this.$.picker1.getValue(), this.$.picker2.getValue()]});
	},
	valueChanged: function(inSender, inEvent) {
		//disable
		this.$.toggle.setValue(false);
	}
});