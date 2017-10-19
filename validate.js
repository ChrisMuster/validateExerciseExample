(function ($) {
	$.fn.validate = function(rules, messages) {

		var form = ($(this).prop('id'));
		var msg  = $.extend({}, $.fn.validate.messages, messages);
		var validForm;
		var append = false;

		var container = $.fn.validate.container[form];

		$(this).keyup(function(event) {
			//$('#' + container).empty();
			inputValid(event.target);
		});

		$(this).submit(function(event) {
			//$('#' + container).empty();
			validForm = true;
			for (var i = 0; i < event.target.length - 1; i++) {
				inputValid(event.target[i]);
			}
			if (!validForm) {
				event.preventDefault();
			}
		});


		function inputValid(input) {
			var id = $(input).prop('id');
			var inputID = id;
			var val  = $(input).val();
			var number = 0;
			var name = $(input).prop('name');

			if(typeof(rules[id]) != 'undefined') {


				for(var ruleName in rules[id]) {
					var ruleValue = rules[id][ruleName];

					try {
						var rule = $.fn.validate.rules[ruleName](val, ruleValue);
					} catch (e) {
						alert("You have called a validation function that isn't defined. \nTried to validate: " + ruleName);
					}

					if(!rule) {
						number++;
						error = msg[ruleName];
						//error = $.fn.validate.messages.byName[name];						
						//if (error == undefined) {
							
						//}
						if (new RegExp("{value}").test(error)){
							error = error.replace("{value}",ruleValue);
						}
						if (error == undefined) {
							error = "This field is not correct.";
						}
					}
				}

				if (number > 0) {		
					$('#' + form + " " + '#'+id).css({
						"border-color":"#FF0000"
					});
				} else {
					$('#' + form + " " + '#'+id).css({
						"border-color":""
					});
				}

				if(container != undefined) {
					id = '#' + container;
					append = true;
				} else {
					id = '#'+id;
					append = false;
				}
				if (append) {
					$(id).find('.' + inputID).remove();
				} else {
					$('#' + form + " " + id).next().remove();
				}	
				if (number > 0) {
					invalid(id, error, inputID);
					validForm = false;
				}
				number = 0;	
			}
		}

		function invalid(id, error, inputID){
			if (append) {
				$(id).append("<span class='" + inputID + "'>" + error + "<br /></span>");
			} else {			
				$('#' + form + " " + id).after("<span>" + error + "</span>");
			}
		}

	}

	$.fn.validate.rules = {
		required : function(inputVal, check) {
			return check && inputVal.length > 0;
		},
		length :  function(inputVal, check) {
			return inputVal.length <= check;
		},
		min : function(inputVal, check) {
			return parseInt(inputVal) >= check;
		},
		max : function(inputVal, check) {
			return parseInt(inputVal) <= check;
		},
		number : function(inputVal, check) {
			return !isNaN(inputVal);
		}
	}

	$.fn.validate.messages = {
		required : "This field is required!",
		length : "This exceeds max length of {value}",
		min : "This needs to be more than {value}",
		max : "This needs to be less than {value}",
		number : "This should be a number!"
	}

	$.fn.validate.messages.byName = {}

	$.fn.validate.messages.form = {}

	$.fn.validate.container = {}
}(jQuery));
