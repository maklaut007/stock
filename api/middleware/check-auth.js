const jwt = require('jsonwebtoken');


module.exports= (req, res, next)=>{
	try{
		let t = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];
		const token = t/*.split(" ")[1];*/ /*If use bearer*/
		const decoded = jwt.verify(token, process.env.JWT_KEY || "secret");
		req.userData= decoded;
		next();
	} catch(error){
		return res.status(401).json({})
	}
}