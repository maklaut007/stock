const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models/models');
const valid = require('../middleware/validation');

exports.user_login = (req, res, next) => { 

	db.query(`SELECT id FROM users WHERE email = ? AND password = ?;`, 
		[req.body.email, req.body.password],
		(err, result)=>{
			if(err) throw err;
			if( result.length===0){
				res.status(422).json({
					field: "password",
					message:"Wrong email or password"
				})
			}
			else{
				const token = jwt.sign({
					email: req.body.email,
					password: req.body.password,
					id: result[0].id

				}, process.env.JWT_KEY || "secret",
				{
					expiresIn: "2d"
				});
				return res.status(200).json({
					token: token
				});
			}
	})
}

exports.user_registration = (req, res, next) => { 
	if(!req.body.name|| !req.body.email || !req.body.password){
		return res.status(422).json({
			field: "data",
			message:"Data is invalid"
		})
	}
	if(!valid.validateEmail(req.body.email)){
		return res.status(422).json({
			field: "email",
			message:"Email is invalid"
		})
	}
	if(req.body.password.length<6){
		return res.status(422).json({
			field: "password",
			message:"Password is too short"
		})
	}
	db.query('SELECT id FROM users WHERE users.email = ?',
	 	[req.body.email], 
	 	(err, countResult)=>{
	 		if(err) throw err;
			 if(countResult.length !== 0){
				res.status(422).json({
					field: "email",
					message: "Email already exists"
				})	 
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if(err) throw err;
					db.query(`INSERT INTO users(name, email, phone, password) VALUES (?, ?, ?, ?)`,
						[req.body.name, req.body.email, req.body.phone, req.body.password],
						(err, result)=>{
							if(err) throw err;
							const token = jwt.sign({
								id: result[0].insertId,
								email: req.body.email,
								password: req.body.password
								}, 
							 	process.env.JWT_KEY || "secret",
								{expiresIn: "2d"}
							);
							return res.status(200).json({
								token: token
							});
						}
					)
				})
			}
		}
	)
}


exports.get_user_items = (req, res, next) => { 
	db.query('SELECT users.id as user_id, users.name, users.phone, users.phone  FROM users WHERE users.id=?',
		[req.params.id],
		(err, selUsersRes)=>{
			if(err) throw err;
			if (selUsersRes.length===0){
				return res.status(404).json();
			}
			else{
				db.query('SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email FROM users INNER JOIN items ON users.id = items.user_id WHERE users.id = ?;',
					[req.params.id],
					(err, result)=>{
						if(err) throw err;
						if (result.length===0){
							return res.status(200).json(models.UserItemsModel(selUsersRes));
						}
						return res.status(200).json(models.UserItemsModel(result));
					}
				)
			}
		}
	)
}
exports.get_curent_user_information = (req, res, next) => { 
	db.query('SELECT id, phone, name, email  FROM users WHERE id = ?',
		[req.userData.id],
		(err, result)=>{
			if(err) throw err;
			if(result.length===0){
				return res.status(401).json();
			}
			let response={
				id: result[0].id,
				name: result[0].name,
				email: result[0].email
			}
			if(result[0].phone){
				response.phone=result[0].phone;
			}
			return res.status(200).json(response);
		}
	)
}
