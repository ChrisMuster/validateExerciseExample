(function($) {

	$.fn.validate = function(options, messages) {

		//Set defaults
		var defaults = {
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
			}
		};

		var defMessages = {
				required: "Field is required!",
				number: "Only enter numbers.",
				min: "Must be a number greater than {value}!",
				max: "Must be a number less than {value}!",
				length: "Must be no longer than {value}!",
				phone: "Must be a valid UK number!"
		};

		//Merge Defaults and options passed in
		$.fn.validate.ruleOpts = $.extend( {}, defaults.rules, options);
		console.log($.fn.validate.ruleOpts);//************************************

		var msg = $.extend( {}, defMessages, messages);
		console.log(msg);//*****************************************

		//RegExp variables
		var regExes = {
			regExEmail: new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/, "i"),

			regExPhone: new RegExp(/^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/),

			regExCard: new RegExp(/^((4\d{3})|(5[1-5]\d{2})|(222\d)|(22[3-9][0-9])|(2[3-6][0-9]{2})|(27[01][0-9])|(2720))(-?|\040?)(\d{4}(-?|\040?)){3}|^(3[4,7]\d{2})(-?|\040?)\d{6}(-?|\040?)\d{5}/)
		};

		/*var test = function(regExes, input) {
			return regExes.regExEmail.test(input);
		};

		var result = test(regExes, "123.hotmail.com");
		console.log(result);	*/	

		//declare variables


		//rule object, functions
		$.fn.validate.rules = {
			required: function(iVal, ruleCheck) {
				return ruleCheck && iVal.length > 0;
			},

			number: function(iVal, ruleCheck) {
				return !isNaN(iVal);
			},

			min: function(iVal, ruleCheck) {
				return parseInt(iVal) >= ruleCheck;
			},

			max: function(iVal, ruleCheck) {
				return parseInt(iVal) <= ruleCheck;
			},

			length: function(iVal, ruleCheck) {
				return iVal.length <= ruleCheck;
			}
		};

		console.log($.fn.validate.rules);//***************************

		//validate when a key is pressed
		$(this).keyup(function(event) {
			inputValidation(event.target);
		});

		//validate when submit button is pressed/clicked


		//function to check if input is valid, returns true or false
		function inputValidation(input) {

		};

		//function to display change when form/fields are invalid

	};
}(jQuery));