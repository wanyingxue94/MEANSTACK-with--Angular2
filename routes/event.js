/**
 * Created by wanyingxue on 2018/3/25.
 */
/**
 * Created by wanyingxue on 2018/3/22.
 */

const Event = require('../models/event'); // Import Blog Model Schema
const config = require('../config/database'); // Import database configuration
var fs = require('fs');

module.exports = (router) => {

    router.post('/newEvent', (req, res) => {
        if (!req.body.eventName) {
            res.json({ success: false, message: 'Event Name is required.' }); // Return error message
        } else {
            if (!req.body.detail) {
                res.json({ success: false, message: 'Event detail is required.' }); // Return error message
            } else {
                const event = new Event({
                    eventName: req.body.eventName, // Title field
                    detail: req.body.detail, // Body field
                    createdBy: req.body.createdBy, // CreatedBy field
                    eventTime: req.body.eventTime,
                    ticketNumber : req.body.ticketNumber,
                    location: req.body.location
                });

                event.save((err) => {
                    if (err) {
                        // Check if error is a validation error
                        if (err.errors) {
                            // Check if validation error is in the title field
                            if (err.errors.title) {
                                res.json({ success: false, message: err.errors.title.message }); // Return error message
                            } else {
                                // Check if validation error is in the body field
                                if (err.errors.body) {
                                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                                } else {
                                    res.json({ success: false, message: err }); // Return general error message
                                }
                            }
                        } else {
                            res.json({ success: false, message: err }); // Return general error message
                        }
                    } else {
                        res.json({ success: true, message: 'Event created!' }); // Return success message
                    }
                });
            }
        }
    });


    /* ===============================================================
     GET SINGLE EVENT
     =============================================================== */
    router.get('/singleEvent/:id', (req, res) => {
        // Check if id is present in parameters
        if (!req.params.id) {
            res.json({ success: false, message: 'No Event ID was provided.' }); // Return error message
        } else {
            // Check if the blog id is found in database
            Event.findOne({ _id: req.params.id }, (err, event) => {
                // Check if the id is a valid ID
                if (err) {
                    res.json({ success: false, message: 'Not a valid event id' }); // Return error message
                } else {
                    // Check if blog was found by id
                    if (!event) {
                        res.json({ success: false, message: 'event not found.' }); // Return error message
                    } else {
                        res.json({ success: true, event: event }); // Return success
                    }
                }
            });
        }
    });

    /* ===============================================================
         GET All EVENT
         =============================================================== */
    router.get('/allEvent/:username', (req, res) => {
        // Check if id is present in parameters
        if (!req.params.username) {
            res.json({ success: false, message: 'No Event username was provided.' }); // Return error message
        } else {
            // Check if the blog id is found in database
            Event.find({ createdBy: req.params.username }, (err, events) => {
                // Check if the id is a valid ID
                if (err) {
                    res.json({ success: false, message: 'Not a valid event id' }); // Return error message
                } else {
                    // Check if blog was found by id
                    if (!events) {
                        res.json({ success: false, message: 'event not found.' }); // Return error message
                    } else {
                        res.json({ success: true, events: events }); // Return success
                    }
                }
            });
        }
    });

    /* ===============================================================
        GET IP
        =============================================================== */
    router.get('/getlocalip',(req,res)=>{
        var ip = require("ip");
        console.dir ( ip.address() );
        res.json({ success: true, ip: ip.address() })
    });


    /* ===============================================================
           GET IP
           =============================================================== */
    router.post('/goToEvent', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'No Event id was provided.' }); // Return error message
        }else{
            searchQuery = {'_id': req.body.id}, updateQuery = {$inc : {'ticketNumber' : -1}}, options = {upsert: true};
            Event.findOneAndUpdate(searchQuery, updateQuery, options, function(err, events){
                if (err) {
                    res.json({ success: false, message: 'Not a valid event id' }); // Return error message
                } else {
                    // Check if blog was found by id
                    if (!events) {
                        res.json({ success: false, message: 'event not found.' }); // Return error message
                    } else {
                        res.json({ success: true, message: 'Evevt Updated!' });
                    }
                }
            });
        }

    });

    return router;
};