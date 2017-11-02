(function($) {

		$("#validate_me").validate({
			rules: {
				email: {
					required: true,
					email: true
				},

				card: {
					required: true,
					card: true
				},

				divisible_by_3: {
					required: true,
					divisible: 3
				}			
			}, 

			messages: {
				email: "Must enter valid email!",
				card: "Must enter valid card no.!",
				divisible: "Must be divisible by 3!"
			},

			regExes: {},

			ruleDefs: {
				email: function(iVal, ruleCheck) {
					if (!ruleCheck) {
						return !ruleCheck;
					} else {
						return $.fn.validate.regExes.regExEmail.test(iVal);
					}
				},

				card: function(iVal, ruleCheck) {
					if (!ruleCheck) {
						return !ruleCheck;
					} else {
						return $.fn.validate.regExes.regExCard.test(iVal);
					}
				},

				divisible: function(iVal, ruleCheck) {
					return (iVal % ruleCheck) === 0;
				}
			},

			container: {
				name: ""
			}
		});	

		$("#validate_me_box").validate({
			rules: {
				email: {
					required: true,
					email: true
				},

				card: {
					required: true,
					card: true
				},

				divisible_by_3: {
					required: true,
					divisible: 3
				}			
			}, 

			messages: {
				email: "Must enter valid email!",
				card: "Must enter valid card no.!",
				divisible: "Must be divisible by 3!"
			},

			regExes: {},

			ruleDefs: {
				email: function(iVal, ruleCheck) {
					return $.fn.validate.regExes.regExEmail.test(iVal);
				},

				card: function(iVal, ruleCheck) {
					return $.fn.validate.regExes.regExCard.test(iVal);
				},

				divisible: function(iVal, ruleCheck) {
					return (iVal % ruleCheck) === 0;
				}
			},

			container: {
				name: "error_box"
			},
		});
	
		//change options individually like this
		$.fn.validate.regExes.regExCard = new RegExp(/^((4\d{3})|(5[1-5]\d{2})|(222\d)|(22[3-9][0-9])|(2[3-6][0-9]{2})|(27[01][0-9])|(2720))(-?|\040?)(\d{4}(-?|\040?)){3}|^(3[4,7]\d{2})(-?|\040?)\d{6}(-?|\040?)\d{5}/);

}(jQuery));