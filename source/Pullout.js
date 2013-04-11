enyo.kind({
	name: "Pullout",
	kind: "enyo.Slideable",
	events: {
		onMovingAverageChanged: "",
		onIndicatorChanged: ""
	},
	components: [
		{name: "shadow", classes: "pullout-shadow"},
		{kind: "onyx.Grabber", classes: "pullout-grabbutton"},
		{kind: "FittableRows", classes: "enyo-fit", components: [
			{name: "client", classes: "pullout-toolbar"},
			{fit: true, style: "position: relative;", components: [
				{name: "info", kind: "Scroller", classes: "enyo-fit", components: [
					{kind: "onyx.Groupbox", classes:"settings", components: [
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "VOL", classes: "labeled-item-icon"},
							{content: "Volume", kind: "Control"},
						]},
					]},
					{kind: "onyx.Groupbox", classes: "settings", components: [
						{kind: "onyx.GroupboxHeader", content: "Moving Averages"},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleMovingAverageChanged", function_name: "SMA", classes: "labeled-item-icon"},
							{content: "Simple", kind: "Control"},
							{kind: "onyx.PickerDecorator", classes: "label-item-input", components: [
								{},
								{name: "smaPicker", kind: "onyx.Picker", components: [
									{content: "5", active: true},
									{content: "10"},
									{content: "20"},
									{content: "50"},
									{content: "100"},
									{content: "200"}
								]}
							]},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleMovingAverageChanged", function_name: "EMA", classes: "labeled-item-icon"},
							{content: "Exponential", kind: "Control"},
							{kind: "onyx.PickerDecorator", classes: "label-item-input", components: [
								{},
								{name: "emaPicker", kind: "onyx.Picker", components: [
									{content: "5", active: true},
									{content: "10"},
									{content: "20"},
									{content: "50"},
									{content: "100"},
									{content: "200"}
								]}
							]},
							
						]},
					]},
					{kind: "onyx.Groupbox", classes: "onyx-groupbox settings", onchange: "mapTypeChange", components: [
						{kind: "onyx.GroupboxHeader", content: "Technical Indicator"},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", config:{function: "RSI", seperate_yaxis: true, series:[{name:"RSI", chart_type: 'line', output_index:1}]}, classes: "labeled-item-icon"},
							{content: "RSI", kind: "Control"},
							{kind: "onyx.MenuDecorator", style:"display:inline-block;float:right",  ontap: "tapHandler", components: [
								{content:"14"},
								{kind: "onyx.ContextualPopup",
									maxHeight: "150",
								//	title: "Period",
									floating: true,
									actionButtons:[
										{content: "Submit"}
									],
									components: [
										{kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
											{kind: "onyx.Input", placeholder: "Enter Param"}
										]}
									]
								}
							]}
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "STOCH", classes: "labeled-item-icon"},
							{content: "STOCH(9,6", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "STOCHRSI", classes: "labeled-item-icon"},
							{content: "STOCHRSI(14)", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "MACD", classes: "labeled-item-icon"},
							{ content: "MACD(12,26)", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "ADX", classes: "labeled-item-icon"},
							{content: "ADX(14)", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "PERC_R", classes: "labeled-item-icon"},
							{content: "Williams %R", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "CCI", classes: "labeled-item-icon"},
							{content: "CCI(14)", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "ATR", classes: "labeled-item-icon"},
							{content: "ATR(14)", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "Highs_Lows", classes: "labeled-item-icon"},
							{content: "Highs/Lows(14)", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "UO", classes: "labeled-item-icon"},
							{content: "Ultimate Oscillator", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "ROC", classes: "labeled-item-icon"},
							{content: "ROC", kind: "Control"},
						]},
						{components:[
							{kind:"onyx.ToggleButton", onChange:"toggleChanged", function_name: "Bull_Bear_Power", classes: "labeled-item-icon"},
							{content: "Bull/Bear Power(13)", kind: "Control"},
						]},
					]}
				]}
			]}
		]}
	],
	max: 100,
	value: 100,
	unit: "%", 
	tapHandler: function(inSender, inEvent) { 
		if (inEvent.actionButton) {
	       console.log(inSender); 
	       console.log(inEvent);

	       inEvent.popup.hide();
   		}
    },
	toggleMovingAverageChanged: function(inSender) { 

		var period;
		
		if(inSender.function_name == "EMA")
			period = this.$.emaPicker.selected.content;

		if(inSender.function_name == "SMA")
			period = this.$.smaPicker.selected.content;

		this.doMovingAverageChanged({enabled: inSender.value, function_name: inSender.function_name, param: [period]});
	},
	toggleChanged: function(inSender) { 
		this.doIndicatorChanged({enabled: inSender.value, function_name: inSender.function_name});
	}
});