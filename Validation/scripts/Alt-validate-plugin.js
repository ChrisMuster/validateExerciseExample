;(function($) {

	var self;
	var validation;
	var okValid;

	$.fn.validate = function(options, elem) {

	//	$.fn.validate.prototype = new Validate(options);
		$.fn.validate.init = function(options, elem) {
			this.elem = elem;
			this.$elem = $(elem);
			console.log(this.elem);
			console.log(this.$elem);
			console.log(this);
		}
		$.fn.validate.init(options, elem);

		return this.each(function() {
			
			self = $(this);

			$.fn.validate.prototype = new Validate(options);

			self.keyup(function(event) {
		//	 	console.log("hi I'm keyup", event);
				isValid(event);
			});

			self.submit(function(event) {
				console.log("hi I'm submit");
				
				okValid = true;

				
				for (var i = 0; i < event.target.length - 1; i++) {
					isValid(event, i);
				}
				
				if (!okValid) {
					event.preventDefault();
				//	alert("Was prevent default called: " + event.isDefaultPrevented());
				}
			});

			function isValid(event, i) {
				$.fn.validate.prototype.isValid(event, i);
			}

		});

	};
	
	function Validate(options) {

		validation = this;
	
		validation.rules = $.extend({}, Validate.prototype.defaults.rules, options.rules);
		validation.messages = $.extend({}, Validate.prototype.defaults.messages, options.messages);
		validation.regExes = $.extend({}, Validate.prototype.defaults.regExes, options.regExes);
		validation.ruleDefs = $.extend({}, Validate.prototype.defaults.ruleDefs, options.ruleDefs);
		validation.container = $.extend({}, Validate.prototype.defaults.container, options.container);
		
		this.isValid = function(event, i) {
			if (i === null || i === undefined) {
				Validate.prototype.defaults.isValid(event.target);
			} else {
				Validate.prototype.defaults.isValid(event.target[i]);
			}
		};

	}

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
				required: "This field is required!",
				number: "Only enter numbers.",
				min: "Must be a no. greater than {value}!",
				max: "Must be a no. less than {value}!",
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
						return Validate.prototype.defaults.regExes.regExPhone.test(iVal);
					}	
				}
			},

		//	container: {
		//		name: ""
		//	},

			isValid: function(input) {
				console.log("hi I'm isValid");//**********

				var form = self.prop("id");
				console.log("form: " + form);//**********************

				var id = $(input).prop("id");
			//	console.log("id: " + id);//************************
			//	console.log("input: ", input);//****************

				var originalID = id;

				var val = $(input).val();
			//	console.log("val: " + val);//***********************

				var errorCount = 0;

				var error = "";

				var append = false;

			//	console.log(validation.rules);
			//	console.log("This: ", validation.rules);
			//	console.log("isValid this.rules: ", validation.rules[id]);
			//	console.log("Type of rules: ", typeof(validation.rules[id]));

				if (typeof(validation.rules[id]) !== "undefined") {
					for(var ruleName in validation.rules[id]) {
						var ruleVal = validation.rules[id][ruleName];
			//			console.log("ruleVal: " + ruleVal);//*******************************
						var rule = validation.ruleDefs[ruleName](val, ruleVal);

			//			console.log("rule: " + rule);//**************

						if (!rule) {
							errorCount++;
							error = validation.messages[ruleName];
							if (validation.regExes.regExValue.test(error)) {
								error = error.replace("{value}", ruleVal);
							}

							if (error === undefined) {
								error = "This field contains errors.";
							}
						}
					}

					if (validation.container.name !== "") {
						id = '#' + validation.container.name;
			//			console.log("container id: " + id);//*******************
						append = true;
					} else {
						id = '#' + id;
			//			console.log("default id: " + id);//*******************
						append = false;
					}

					if (append) {
						$(id).find('.' + originalID).remove();
					} else {
						$('#' + form + " " + id).next().remove();
					}

					if (errorCount > 0) {														 
						$('#' + form + " " + "#" + originalID).css({"border": "2px solid red"}); 
						this.invalidInput(append, id, error, originalID, form);			
						okValid = false;									
					} else {														
						$('#' + form + " " + "#" + originalID).css({"border": ""});	
					}

					//reset errorCount
					errorCount = 0;
				}
			},
//************************************************************************************************
			invalidInput: function(append, id, error, originalID, form) {
				console.log("hi I'm invalidInput");
				if (append) {
					$(id).append("<p class='" + originalID + "'>" + "<img src='images/cancel.svg' style='height: 14px; width: 14x' />" + " " + originalID.toUpperCase() + ": " + error +"<br /></p>");
				} else {
					$('#' + form + " " + id).after("<span class='warningMsg'>" + "<img src='images/cancel.svg' style='height: 14px; width: 14x' />" + " "  + error + "</span>");
				}
			}
		}
	};
		
}(jQuery));