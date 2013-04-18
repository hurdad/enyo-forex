enyo.kind({
	name: "ParamPicker",
	kind: "onyx.MenuDecorator", 
	style: "display:inline-block;float:right",  
	published: {	
		title: "Parameter",
		value: 14,
		patt: /^\d{1,2}$/
	},
	events: {
		onValueChanged: "",
	},
	components: [
		{name: "label"},
		{name: "popup", 
			kind: "onyx.ContextualPopup",
			maxHeight: "150",
			floating: true,
			actionButtons:[
				{content: "Submit"}
			],
			ontap: "tapHandler", 
			components: [
				{kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
					{name: "input", kind: "onyx.Input",  onchange:"inputChanged", placeholder: "Enter Value.."},
					{name: "error", showing: false, tag: "img", attributes: {src: "assets/exclamation_red.png"}},
				]}
			]
		}
	],
	rendered: function(){
		this.inherited(arguments); 

		this.$.label.setContent(this.value);
		this.$.input.setValue(this.value);
		this.$.popup.setTitle(this.title);
	},
	updateValue: function(){
		this.$.label.setContent(this.value);
		this.$.input.setValue(this.value);
	},
	inputChanged: function(inSender, inEvent) {
	
		var val = inSender.getValue();
	
		if(!this.patt.test(val))
			this.$.error.show();
		else
			this.$.error.hide();
	
	},
	tapHandler: function(inSender, inEvent) { 
	
		if (inEvent.actionButton) {

			if(!this.$.error.showing){

				if(this.value != this.$.input.getValue())
					this.doValueChanged();

				this.$.label.setContent(this.$.input.getValue());
				this.value = this.$.input.getValue();

		       	inEvent.popup.hide();
	       }
   		}
    },
});