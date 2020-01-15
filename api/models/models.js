exports.ItemModel = (data, customData)=>{
	if (!customData){
			var customData= {};
	}
	let  res={};
	res.id= customData.id || data.id;
	res.created_at= customData.created_at || data.created_at;
	res.title= customData.title || data.title;
	res.price= customData.price || data.price;
	res.image= customData.image || data.image;
	res.user={};
	res.user.id= customData.user_id || data.user_id;
	if(customData.phone || data.phone) {res.user.phone= customData.phone || data.phone;}
	res.user.email= customData.email || data.email;
	return res
};


exports.UserItemsModel = (items)=>{
	let res = {
		user_id: items[0].user_id,
		name: items[0].name,
		email: items[0].email
	};
	if (items[0].phone){
		res.phone = items[0].phone
	}
	if (items[0].id){
		res.items = items.map((item)=>{
		let x = {};
		x.id= item.id 
		x.created_at= item.created_at 
		x.title= item.title 
		x.price= item.price 
		x.image= item.image 
		return x
	})
	}else {
		res.items=[];
	}
	return res
}

