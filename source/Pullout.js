enyo.kind({
	name: "Pullout",
	kind: "enyo.Slideable",
	events: {
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
						{kind: "VOL", onToggleChanged: "toggleChanged"},
					]},
					{kind: "onyx.Groupbox", classes: "settings", components: [
						{kind: "onyx.GroupboxHeader", content: "Moving Averages"},
						{kind: "SMA", label: "Simple 1", param1: 20, instance: 1, onToggleChanged: "toggleChanged"},
						{kind: "SMA", label: "Simple 2", param1: 50, instance: 2, onToggleChanged: "toggleChanged"},
						{kind: "SMA", label: "Simple 3", param1: 200, instance: 3, onToggleChanged: "toggleChanged"},
						{kind: "EMA", label: "Exponential 1", param1: 20, instance: 1, onToggleChanged: "toggleChanged"},
						{kind: "EMA", label: "Exponential 2", param1: 50, instance: 2, onToggleChanged: "toggleChanged"},
						{kind: "EMA", label: "Exponential 3", param1: 200, instance: 3, onToggleChanged: "toggleChanged"}
					]},
					{kind: "onyx.Groupbox", classes: "onyx-groupbox settings", onchange: "mapTypeChange", components: [
						{kind: "onyx.GroupboxHeader", content: "Technical Indicator"},
						{kind: "RSI", onToggleChanged: "toggleChanged"},
						{kind: "STOCH", onToggleChanged: "toggleChanged"},
						{kind: "STOCHRSI", onToggleChanged: "toggleChanged"},
						{kind: "MACD", onToggleChanged: "toggleChanged"},
						{kind: "ADX", onToggleChanged: "toggleChanged"},
						{kind: "Williams_perc", onToggleChanged: "toggleChanged"},
						{kind: "CCI", onToggleChanged: "toggleChanged"},
						{kind: "ATR", onToggleChanged: "toggleChanged"},
						{kind: "Highs_Lows", onToggleChanged: "toggleChanged"},
						{kind: "UO", onToggleChanged: "toggleChanged"},
						{kind: "ROC", onToggleChanged: "toggleChanged"},
						{kind: "Bull_Bear_Power", onToggleChanged: "toggleChanged"}
					]}
				]}
			]}
		]}
	],
	max: 100,
	value: 100,
	unit: "%", 
	toggleChanged: function(inSender, inEvent) {
		this.doIndicatorChanged(inEvent);
	}
});