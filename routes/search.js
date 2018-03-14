/**
 * Created by wanyingxue on 2017/12/3.
 */

const Blog = require('../models/blog'); // Import Blog Model Schema
const config = require('../config/database'); // Import database configuration
var fs = require('fs');

module.exports = (router) => {

    router.get('/text/:text', (req, res) => {
        if (!req.params.text) {
            res.json({ success: false, message: 'Nothing to search.' }); // Return error message
        } else {
            var query = {$or:[{title:{$regex: req.params.text, $options: 'i'}},{body:{$regex: req.params.text, $options: 'i'}}]}
            Blog.find(query , function (err,blogs) {
                if(err){
                    res.json({ success: false, message: err });
                }else{
                    res.json({ success: true, blogs: blogs });
                }
            }).sort({ '_id': -1 });
        }
    });

    router.get('/tags/:tag', (req, res) => {
        if (!req.params.tag) {
            res.json({ success: false, message: 'Nothing to search.' }); // Return error message
        } else {
            Blog.find( { tags : req.params.tag.toString() } , function (err,blogs) {
                if(err){
                    res.json({ success: false, message: err });
                }else{
                    res.json({ success: true, blogs: blogs });
                }
            }).sort({ '_id': -1 });
        }
    });

    return router;
};