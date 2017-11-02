;(function($) {
//************************************************************************************************************
//PLUGIN starts
	$.fn.validate = function(options) {
		return this.each(function() {
			var vali = new Validate(options);
		//	console.log(vali.rules);
		//	console.log(vali.regExes);
			var okValid;
			var self = $(this);

//************************************************************************************************************

			self.keyup(function(event) {
				isValid(event.target);
			});
	
//************************************************************************************************************

			self.submit(function(event) {
				//set variable to true, function will change it later if necessary
				okValid = true;

				//Iterate over all the fields and check each one has valid input or not
				for (var i = 0; i < event.target.length - 1; i++) {
					isValid(event.target[i], okValid);
					console.log(okValid);//************************************************
				}
				//then if any input is invalid, prevent the submit function from working
				if (!okValid) {
					event.preventDefault();
					alert("Was prevent default called: " + event.isDefaultPrevented());
				}
			});

//************************************************************************************************************

			function isValid(input, okValid) {
			//	console.log(input);//***********
				var form = self.prop("id");
			//	console.log(form);//************
				var id = $(input).prop("id");
			//	console.log(id);//**************
				var originalID = id;
				//console.log(originalID);//******
				var val = $(input).val();
			//	console.log(val);//*************
				var errorCount = 0;
				var error = "";
				var append = false;
			//	console.log(self);//**********

				if (typeof(vali.rules[id]) !== "undefined") {
					for (var ruleName in vali.rules[id]) {
						var ruleVal = vali.rules[id][ruleName];

						var rule = vali.ruleDefs[ruleName](val, ruleVal);

						if (!rule) {
							errorCount++;
							error = vali.messages[ruleName];
							if (vali.regExes.regExValue.test(error)) {
								error = error.replace("{value}", ruleVal);
							}

							if (error === undefined) {
								error = "This field contains errors.";
							}
						}
					}

					if (vali.container.name !== "") {
						id = '#' + vali.container.name;
						console.log(id);
						append = true;
					}	 else {
						id = '#' + id;
						append = false;
						console.log(id);
					}

					if (append) {
						$(id).find('.' + originalID).remove();
					} else {
						$('#' + form + " " + id).next().remove();
					}

					if (errorCount > 0) {
						$('#' + form + " " + "#" + originalID).css({"border": "2px solid red"});
						invalidInput(append, id, error, originalID, form);
						okValid = false;
					} else {
						$('#' + form + " " + "#" + originalID).css({"border": ""});
					}

					//reset errorCount
					errorCount = 0;
				}
				return okValid;
			}

//*************************************************************************************************************

			function invalidInput(append, id, error, originalID, form) {
				if (append) {
					$(id).append("<p class='" + originalID + "'>" + "<img src='images/cancel.svg' style='height: 14px; width: 14x' />" + " " + originalID.toUpperCase() + ": " + error +"<br /></p>");
				} else {
					$('#' + form + " " + id).after("<span class='warningMsg'>" + "<img src='images/cancel.svg' style='height: 14px; width: 14x' />" + " "  + error + "</span>");
				}
			}
		});
	};

	console.log($.fn.validate);

//*************************************************************************************************************

	function Validate(options) {
		this.rules = $.extend({}, Validate.prototype.rules, options.rules);
		this.messages = $.extend({}, Validate.prototype.messages, options.messages);
		this.regExes = $.extend({}, Validate.prototype.regExes, options.regExes);
		this.ruleDefs = $.extend({}, Validate.prototype.ruleDefs, options.ruleDefs);
		this.container = $.extend({}, Validate.prototype.container, options.container);

	//	console.log(this.rules);
	//	console.log(this.messages);
	//	console.log(this.regExes);
		console.log(this.ruleDefs);
	//	console.log(this.container);
		console.log(this);
	}

	Validate.prototype.rules = {
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
	};

	Validate.prototype.messages = {
									required: "This field is required!",
									number: "Only enter numbers.",
									min: "Must be a no. greater than {value}!",
									max: "Must be a no. less than {value}!",
									length: "Must be no longer than {value}!",
									phone: "Must be a valid UK number!"
	};

	Validate.prototype.regExes = {
		regExEmail: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/, "i"),

		regExPhone: new RegExp(/^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/),

		regExCard: new RegExp(/^((4\d{3})|(5[1-5]\d{2})|(222\d)|(22[3-9][0-9])|(2[3-6][0-9]{2})|(27[01][0-9])|(2720))(-?|\040?)(\d{4}(-?|\040?)){3}|^(3[4,7]\d{2})(-?|\040?)\d{6}(-?|\040?)\d{5}/),

		regExValue: new RegExp(/{value}/)
	};

//	console.log(Validate.prototype.regExes.regExEmail);

	Validate.prototype.ruleDefs = {
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
											return Validate.prototype.regExes.regExPhone.test(iVal);
										}	
									}
	};

	Validate.prototype.container = {
									name: ""
	};

}(jQuery));