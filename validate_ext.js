$.fn.validate.rules.email = function(inputVal, check) {
	return new RegExp("\\w@\\w{1,20}\\.\\w{1,6}").test(inputVal);
};

$.fn.validate.rules.credit_card = function(inputVal, check) {
	return new RegExp("\\d{4}-\\d{4}-\\d{4}-\\d{4}").test(inputVal);
};

$.fn.validate.rules.phone = function(inputVal, check) {
	/*regex from http://stackoverflow.com/questions/25155970/validating-uk-phone-number-regex-c*/
	return /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/.test(inputVal);
};

$.fn.validate.rules.divisible = function(inputVal, check) {
	return (inputVal % check) == 0;
};

$.fn.validate.messages.email = "Email is not valid";
$.fn.validate.messages.credit_card = "Please enter a valid card like so ####-####-####-####";
$.fn.validate.messages.phone = "Please enter a valid UK phone number";
$.fn.validate.messages.divisible = "That number is not divisible";

$.fn.validate.messages.byName.custom1 = "Custom message!";

$.fn.validate.container.validate_me = "mover";
//$.fn.validate.container.validate_me2 = "mover2";
