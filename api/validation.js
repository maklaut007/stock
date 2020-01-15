let validateEmail = (email) =>{
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
}
let validateItemTitle = (title) =>{
	if(!title){
		return {
			"field":"title",
			"message":"Title is required"
		}
	}
	if(title.length<=3) {
		return{
				"field":"title",
				"message":"Title is too short"
		}
	}
	return false
}
let validateItemPrice = (price) =>{
	if(!price){
		return {
			"field":"price",
			"message":"Price is required"
		};
	}
    if(isNaN(price)){
		return {
			"price":"price",
			"message":"Price is not a number"
		};
	}
	return false
}


module.exports = {validateEmail, validateItemTitle, validateItemPrice};