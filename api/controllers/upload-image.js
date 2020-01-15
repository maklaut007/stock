const multer = require('multer');
const db = require('../database');
const fs = require('fs');
const models = require('../models/models');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,__dirname + '/../uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'-' + file.originalname);
    }
});
let fileFilter = function (req, file, cb) {
    var allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb({
            status: "Invalid type"
        }, false);
    }
};
let obj = {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024  * 5
},
    fileFilter: fileFilter
};
const upload = multer(obj).single('itemImage');
exports.imageUpload = (req, res) => {
    db.query('SELECT image FROM items WHERE items.id = ? AND user_id = ?;',
        [req.params.id, req.userData.id],
        (err, oldImgSelRes)=>{
            if(err) throw err;
            if(oldImgSelRes.length===0){
                return res.status(404).json({});
            }else {
                upload(req, res, function (err) {

                    if (err) { 
                        if(err.status==="Invalid type"){
                            return res.status(422).json({
                                field: "image",
                                message: 'Invalid image type',
                            })
                        }
                        return res.status(422).json({
                            "field":"image",
                            "message":"The image is too big. "
                        });
                    } else {
                        if (!req.file) {
                            res.status(422).json({
                            "field":"image",
                            "message":"Image not found"
                            });
                        }
                        else{
                            db.query('UPDATE items SET image = ?  WHERE id = ? ;',
                                [req.file.path, req.params.id],
                                (err, updRes)=>{
                                    if(err) throw err; 
                                    if(!oldImgSelRes[0].image.match(/\w*images\/default-image.jpg\b/) ){
                                        fs.unlink(oldImgSelRes[0].image, (err) => {
                                            if(err) throw err;
                                        });
                                    } 
                                    db.query('SELECT items.id, TIME_TO_SEC(items.created_at) as created_at, items.title, items.price, items.image, items.user_id, users.name, users.phone, users.email FROM items INNER JOIN users ON users.id = items.user_id WHERE items.id = ? ',
                                        [req.params.id],
                                        (err, result)=>{
                                            if(err) throw err;
                                            return res.status(200).json(models.ItemModel(result[0]));
                                        }
                                    )               
                                }
                            )
                        }
                    }
                })
            }
        }
    )
};