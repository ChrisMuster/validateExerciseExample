;(function($) {
	//************************************************************************************************************
	//PLUGIN starts
	$.fn.validate = function(options) {
		return this.each(function() {
			//setup variables
			var okValid;
			var self = $(this);
			var vali = this;
			vali.rules = $.extend({}, $.fn.validate.rules, options.rules);
			vali.messages = $.extend({}, $.fn.validate.messages, options.messages);
			vali.regExes = $.extend({}, $.fn.validate.regExes, options.regExes);
			vali.ruleDefs = $.extend({}, $.fn.validate.ruleDefs, options.ruleDefs);
			vali.container = $.extend({}, $.fn.validate.container, options.container); 

	//**********************************************************************************************************************************************
	//Check each individual field to see if it is valid when any key in that field is pressed
			self.keyup(function(event) {
				isValid(event.target);
			});
	//**********************************************************************************************************************************************
	//Check whole form is valid when submit key is pressed
			self.submit(function(event) {
				//set variable to true, function will change it later if necessary
				okValid = true;

				//Iterate over all the fields and check each one has valid input or not
				for (var i = 0; i < event.target.length - 1; i++) {
					isValid(event.target[i]);
				}

				//then if any input is invalid, prevent the submit function from working
				if (!okValid) {
					event.preventDefault();
					//alert("Was prevent default called: " + event.isDefaultPrevented());
				}
			});
	//**********************************************************************************************************************************************
	//Function to check whether inputs are valid or not
			function isValid(input) {
				//Set variables to use inside the function
				var form = self.prop("id");		//example: #validate_me/#validate_me_box
				var id = $(input).prop("id");   //id of the input boxes (name, age, email, card, divisible_by_3)
				var originalID = id; 			//A copy of the input id in case the id variable needs to change later
				var val = $(input).val(); 		//The value entered into the input fields
				var errorCount = 0; 			//Keep a count of how many errors found
				var error = ""; 				//Blank, used to hold different error messages depending on circumstances
				var append = false; 			//If true, add to or remove error messages from separate container, else 
													//add or remove after the input field

				//Checks each input against each rule associated with that input
				if (typeof(vali.rules[id]) !== "undefined") {				//make sure rules are defined
					for (var ruleName in vali.rules[id]) {					//iterate through each rule
						var ruleVal = vali.rules[id][ruleName];				//set current value to the current rule value

						var rule = vali.ruleDefs[ruleName](val, ruleVal);	//set rule to the result of checking the input against the rule

						if (!rule) {										//if rule is false
							errorCount++;									//add 1 to the error_count
							error = vali.messages[ruleName];				//set error message to the correct message for that rule
							if (vali.regExes.regExValue.test(error)) {		//if the error message has the word {value} in it,
								error = error.replace("{value}", ruleVal);	//replace the word {value} with the actual current value
							}
						}

						if (error === undefined) {
							error = "This field contains errors.";
						}
					}
				}

				if (vali.container.name !== "") {				//if the container has a name then
					id = '#' + vali.container.name;				//the id becomes the container name and
					append = true;								//we will be appending to that container
				} else {										//otherwise
					id = '#' + id;								//the id remains the same as the input field
					append = false;								//and we won't be appending to the container
				}

				if (append) {									//if we are appending to the container then
					$(id).find('.' + originalID).remove();		//go to the container and remove the previous message if any
																//so that we can set the new error message
				} else {										//otherwise
					$('#' + form + " " + id).next().remove();	//find the input field instead and remove any messages we 
				}												//placed after it so we can set the new error message

				if (errorCount > 0) {														  //if there are errors
					$('#' + form + " " + "#" + originalID).css({"border": "2px solid red"});  //put a red border around the input field
					invalidInput(append, id, error, originalID, form);			//call the function to place the error messages
					okValid = false;									//set to false, so we can't submit the form with errors
				} else {														//otherwise if no errors
					$('#' + form + " " + "#" + originalID).css({"border": ""});	//remove red borders and leave okValid as true
				}																//so form can be submitted

				//reset errorCount to prevent false positives
				errorCount = 0;
			}

	//****************************************************************************************************************************************************************************************************
	//if append is true then find the container and add an image and an error message to it
	//otherwise, place an image and an error message after the input field
			function invalidInput(append, id, error, originalID, form) {
				if (append) {
					$(id).append("<p class='" + originalID + "'>" + "<img src='images/cancel.svg' style='height: 14px; width: 14x' />" + " " + originalID.toUpperCase() + ": " + error +"<br /></p>");
				} else {
					$('#' + form + " " + id).after("<span class='warningMsg'>" + "<img src='images/cancel.svg' style='height: 14px; width: 14x' />" + " "  + error + "</span>");
				}
			}
		});
	};

	//****************************************************************************************************************************************************************************************************
	//Rules object
	$.fn.validate.rules = {
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

	//Messages object
	$.fn.validate.messages = {
			required: "This field is required!",
			number: "Only enter numbers.",
			min: "Must be a no. greater than {value}!",
			max: "Must be a no. less than {value}!",
			length: "Must be no longer than {value}!",
			phone: "Must be a valid UK number!"
	};

	//Regular Expressions object
	$.fn.validate.regExes = {
			regExEmail: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/, "i"),

			regExPhone: new RegExp(/^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/),
		//blanked out to show that it can be passed as an option as well
		//	regExCard: new RegExp(/^((4\d{3})|(5[1-5]\d{2})|(222\d)|(22[3-9][0-9])|(2[3-6][0-9]{2})|(27[01][0-9])|(2720))(-?|\040?)(\d{4}(-?|\040?)){3}|^(3[4,7]\d{2})(-?|\040?)\d{6}(-?|\040?)\d{5}/),

			regExValue: new RegExp(/{value}/)
	};

	//Rule Definitions object
	$.fn.validate.ruleDefs = {
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
					return $.fn.validate.regExes.regExPhone.test(iVal);
				}	
			}
	};

	//Container name object (blank by default, can be given a name when passing options)
	$.fn.validate.container = {
				name: ""
	};

}(jQuery));