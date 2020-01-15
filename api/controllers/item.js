const db = require('../database');
const fs = require('fs');
const models = require('../models/models');
const valid = require('../validation');

exports.get_all_items = (req, res, next) => { 
	db.query('SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email FROM items INNER JOIN users ON users.id = items.user_id',
		(err, result)=>{
			if(err) throw err;
			
			let items=result.map((e)=>{
				return models.ItemModel(e);
			});
			return res.status(200).json(items);
		}
	)
}
exports.get_one_item = (req, res, next) => { 
	db.query('SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email FROM items INNER JOIN users ON users.id = items.user_id WHERE items.id = ?',
		[req.params.id],
		(err, result)=>{
			if(err) throw err;
			if(result.length===0){
				return res.status(404).json();
			}
			return res.status(200).json(models.ItemModel(result[0]));
		}
	)
}
exports.create_item = (req, res, next) => { 
	if(valid.validateItemTitle(req.body.title)){
		return res.status(422).json(valid.validateItemTitle(req.body.title));
	}
	if(valid.validateItemPrice(req.body.price)){
		return res.status(422).json(valid.validateItemPrice(req.body.price));
	}
    db.query('INSERT INTO items(title, price, user_id, image) VALUES (?,?,?,?)',
    	[req.body.title, req.body.price, req.userData.id, __dirname+ '/../uploads/images/default-image.jpg'],
		(err, insRes)=>{
			if(err) throw err;
			db.query('SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email FROM items INNER JOIN users ON users.id = items.user_id WHERE items.id = ?',
				[insRes.insertId], 
				(err, result)=>{
					if(err) throw err;
					return res.status(200).json(models.ItemModel(result[0]));
				}
			)
		} 
	);
}

exports.update_item = (req, res, next) => {  
			
			if(req.body.price && isNaN(req.body.price)){
				return res.status(422).json({
					"price":"price",
					"message":"Price is not a number"
				})
			}
			if(req.body.title &&req.body.title.length<=3) {
				return res.status(422).json({
					"field":"title",
					"message":"Title is too short"
				})
			}
	db.query('SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id as user_id, users.name, users.phone, users.email FROM items INNER JOIN users ON users.id = items.user_id WHERE items.id = ? ;', 
			[req.params.id],
			(err, selRes)=>{ 	
				if(selRes.length===0){
					return res.status(404).json();
				}
				if(req.userData.id!==selRes[0].user_id){
					return res.status(403).json();
				}
				
				let title = req.body.title || selRes[0].title,
				price = req.body.price || selRes[0].price;
				db.query('UPDATE items SET title = ?, price = ?  WHERE items.id = ? AND items.user_id = ?;',
					[title, price, req.params.id,  req.userData.id],
					(err, result)=>{
						if(err) throw err;
						return res.status(200).json(models.ItemModel(selRes[0], {title: title, price: price}));
					}	
				)	
			}
		)
} 
exports.delete_item = (req, res, next) => { 
	db.query('SELECT user_id, image FROM items WHERE items.id = ? ;',
		[req.params.id],
		(err, selRes)=>{ 
			console.log(selRes[0].user_id, req.userData.id);
			if(err) throw err;
    		if(selRes.length===0){  
				return res.status(404).json({});
			} 

			else if(selRes[0].user_id!==req.userData.id){
				return res.status(403).json({});
			} else {
				db.query('DELETE FROM items WHERE items.id = ? AND items.user_id= ?;',
    				[req.params.id, req.userData.id],
    				(err, result)=>{
    					if(err) throw err;
    					if(!selRes[0].image.match(/\w*images\/default-image.jpg\b/) ){
								fs.unlink(selRes[0].image, (err) => {
									if(err) throw err;
							});
						}
    				return res.status(200).json({})
    				}
    			)
			}
    	}
	)
}








