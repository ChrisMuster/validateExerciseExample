(function($) {
  //Overview: create a Validate object to do the processing, then add it to jQuery
    $.fn.validate = function(options) {
		new Validate(options);
		return this;
	};
	//Create a Validate object constructor function
	function Validate(options) {
		rules = this.rules = $.extend({}, this.defaults.rules, options.rules);
		messages = this.messages = $.extend({}, this.defaults.messages, options.messages);
		regExes = this.regExes = $.extend({}, this.defaults.regExes, options.regExes);
		ruleDefs = this.ruleDefs = $.extend({}, this.defaults.ruleDefs, options.ruleDefs);
		container = this.container = $.extend({}, this.defaults.container, options.container);

		keyup = this.keyup = function(event) {
			console.log("hi");
			this.isValid(this.event.target); //call to check if input is valid after every keystroke
		};
		this.submit = function(event) {this.defaults.submit(event)};
		this.isValid = function(input) {this.defaults.isValid(input)};
		this.invalidInput = function(id, error, originalID) {this.defaults.invalidInput(id, error, originalID)};

		//rules = this.rules;
		//messages = this.messages;
		//regExes = this.regExes;
		//ruleDefs = this.ruleDefs;
		//container = this.container;
	//console.log(rules);
	//console.log(messages);
	//console.log(regExes);
	//console.log(ruleDefs);
	//console.log(container.name);
	console.log(keyup);
	};

	//Create a Validate prototype, with all the code that the function uses by default
	Validate.prototype = {
		defaults: {
			rules: {
				name: {
					required: true,
					length: 25
				},

				age: {
					required: true,
					number: true,
					min: 18,
					max: 140,
					length: 3
				},

				phone: {
					required: true,
					phone: true
				}
			},

			messages: {
				required: "Field is required!",
				number: "Only enter numbers.",
				min: "Must be a number greater than {value}!",
				max: "Must be a number less than {value}!",
				length: "Must be no longer than {value}!",
				phone: "Must be a valid UK number!"
			},

			regExes: {
				regExEmail: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/, "i"),

				regExPhone: new RegExp(/^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/),

				regExCard: new RegExp(/^((4\d{3})|(5[1-5]\d{2})|(222\d)|(22[3-9][0-9])|(2[3-6][0-9]{2})|(27[01][0-9])|(2720))(-?|\040?)(\d{4}(-?|\040?)){3}|^(3[4,7]\d{2})(-?|\040?)\d{6}(-?|\040?)\d{5}/),

				regExValue: new RegExp(/{value}/)
			},

			ruleDefs: {
				required: function(iVal, ruleCheck) {
					if (!ruleCheck) {
						return !ruleCheck;
					} else {
						return iVal.length > 0;
					}
				},

				number: function(iVal, ruleCheck) {
					if (!ruleCheck) {
						return !ruleCheck;
					} else {
						return !isNaN(iVal);
					}
				},

				min: function(iVal, ruleCheck) {
					return parseInt(iVal) >= ruleCheck;
				},

				max: function(iVal, ruleCheck) {
					return parseInt(iVal) <= ruleCheck;
				},

				length: function(iVal, ruleCheck) {
					return iVal.length <= ruleCheck;
				},

				phone: function(iVal, ruleCheck) {
					if (!ruleCheck) {
						return !ruleCheck;
					} else {
						return regExes.regExPhone.test(iVal);
					}	
				}
			},

			container: {
				name: ""
			}, //if you want to display errors separately, specify "error_box" or include in options

			keyup: function(event) {
		 	console.log("hi");
				this.isValid(this.event.target); //call to check if input is valid after every keystroke
			},

			submit: function(event) {
				//set variable to true, function will change it later if necessary
				var okValid;

				//Iterate over all the fields and check each one has valid input or not
				for (var i = 0; i < this.event.target.length - 1; i++) {
					this.isValid(this.event.target[i]);
					console.log(okValid);
				}
				//then if any input is invalid, prevent the submit function from working
				if (!okValid) {
					this.event.preventDefault();
				}
			},
//****************************************************************************************************************
			isValid: function(input) {
				var form = $(this).prop("id");
				var id = $(input).prop("id");
				var originalID = id;
				var val = $(input).val();
				var errorCount = 0;
				var error = "";
				var append = false;

				console.log(form);

				if(typeof(rules[id]) != "undefined") {
					for(var ruleName in rules[id]) {
						var ruleVal = rules[id][ruleName];

						var rule = this.ruleDefs[ruleName](val, ruleVal);

						if (!rule) {
							errorCount++;
							error = messages[ruleName];
							if (regExes.regExValue.test(error)) {
								error = error.replace("{value}", ruleVal);
							};

							if (error == undefined) {
								error = "This field contains errors.";
							};
						};
					};

					if (errorCount > 0) {
						$('#' + form + " " + '#' + id).css({
							"border": "2px solid red"
						});
					} else {
						$('#' + form + " " + '#' + id).css({
							"border": ""
						});
					};

					if (container.name != undefined) {
						id = '#' + container.name;
						console.log(id);
						append = true;
					}	 else {
						id = '#' + id;
						append = false;
					};

					if (append) {
						$(id).find('.' + originalID).remove();
					} else {
						$('#' + form + " " + id).next().remove();
					};

					if (errorCount > 0) {
						this.invalidInput(id, error, originalID);
						okValid = false;
					};

					//reset errorCount
					errorCount = 0;
				};
			},
//************************************************************************************************
			invalidInput: function(id, error, originalID) {
				if (append) {
					$(id).append("<td class='" + originalID + "'>" + error +"<br /></td>");
				} else {
					$('#' + form + " " + id).after("<td class='warningMsg'>" + error + "</td>");
				};
			}
		}
	};
//************************************************************************************************
	//Create a new instance of the Validate object, called validate, and add to jQuery as a plugin
/*	$.fn.validate = function(options) {
		new Validate($(this), options);
		return this;
	};  */

}(jQuery)); 
