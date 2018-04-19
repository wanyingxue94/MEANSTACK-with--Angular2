const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {
    /* ==============
     Register Route
     ============== */
    router.post('/register', (req, res) => {
        // Check if email was provided
        if (!req.body.email) {
            res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({ success: false, message: 'You must provide a username' }); // Return error
            } else {
                // Check if password was provided
                if (!req.body.password) {
                    res.json({ success: false, message: 'You must provide a password' }); // Return error
                } else {
                    // Create new user object and apply user input
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    // Save user to database
                    user.save((err) => {
                        // Check if error occured
                        if (err) {
                            // Check if error is an error indicating duplicate account
                            if (err.code === 11000) {
                                res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
                            } else {
                                // Check if error is a validation rror
                                if (err.errors) {
                                    // Check if validation error is in the email field
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message }); // Return error
                                    } else {
                                        // Check if validation error is in the username field
                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message }); // Return error
                                        } else {
                                            // Check if validation error is in the password field
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message }); // Return error
                                            } else {
                                                res.json({ success: false, message: err }); // Return any other error not already covered
                                            }
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'Acount registered!' }); // Return success
                        }
                    });
                }
            }
        }
    });

    /* ============================================================
     Route to check if user's email is available for registration
     ============================================================ */
    router.get('/checkEmail/:email', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.email) {
            res.json({ success: false, message: 'E-mail was not provided' }); // Return error
        } else {
            // Search for user's e-mail in database;
            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err }); // Return connection error
                } else {
                    // Check if user's e-mail is taken
                    if (user) {
                        res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
                    } else {
                        res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
                    }
                }
            });
        }
    });

    /* ===============================================================
     Route to check if user's username is available for registration
     =============================================================== */
    router.get('/checkUsername/:username', (req, res) => {
        // Check if username was provided in paramaters
        if (!req.params.username) {
            res.json({ success: false, message: 'Username was not provided' }); // Return error
        } else {
            // Look for username in database
            User.findOne({ username: req.params.username }, (err, user) => { // Check if connection error was found
                if (err) {
                    res.json({ success: false, message: err }); // Return connection error
                } else {
                    // Check if user's username was found
                    if (user) {
                        res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
                    } else {
                        res.json({ success: true, message: 'Username is available' }); // Return as vailable username
                    }
                }
            });
        }
    });

    /* ========
     LOGIN ROUTE
     ======== */
    router.post('/login', (req, res) => {
        // Check if username was provided
        if (!req.body.username) {
            res.json({ success: false, message: 'No username was provided' }); // Return error
        } else {
            // Check if password was provided
            if (!req.body.password) {
                res.json({ success: false, message: 'No password was provided.' }); // Return error
            } else {
                // Check if username exists in database
                User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                    // Check if error was found
                    if (err) {
                        res.json({ success: false, message: err }); // Return error
                    } else {
                        // Check if username was found
                        if (!user) {
                            res.json({ success: false, message: 'Username not found.' }); // Return error
                        } else {
                            const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                            // Check if password is a match
                            if (!validPassword) {
                                res.json({ success: false, message: 'Password invalid' }); // Return error
                            } else {
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
                                res.json({
                                    success: true,
                                    message: 'Success!',
                                    token: token,
                                    user: {
                                        username: user.username
                                    }
                                }); // Return success and token to frontend
                            }
                        }
                    }
                });
            }
        }
    });

    /* ================================================
     MIDDLEWARE - Used to grab user's token from headers
     ================================================ */
    router.use((req, res, next) => {
        const token = req.headers['authorization']; // Create token found in headers
        // Check if token was found in headers
        if (!token) {
            res.json({ success: false, message: 'No token provided' }); // Return error
        } else {
            // Verify the token is valid
            jwt.verify(token, config.secret, (err, decoded) => {
                // Check if error is expired or invalid
                if (err) {
                    res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
                } else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    });

    /* ===============================================================
     Route to get user's profile data
     =============================================================== */
    router.get('/profile', (req, res) => {
        // Search for user in database
        User.findOne({ _id: req.decoded.userId }).select('username email follows followers aboutme avatar score blogScore likeScore linkScore').exec((err, user) => {
            // Check if error connecting
            if (err) {
                res.json({ success: false, message: err }); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
                } else {
                    res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
                }
            }
        });
    });

    /* ===============================================================
     Route to get user's public profile data
     =============================================================== */
    router.get('/publicProfile/:username', (req, res) => {
        // Check if username was passed in the parameters
        if (!req.params.username) {
            res.json({ success: false, message: 'No username was provided' }); // Return error message
        } else {
            // Check the database for username
            User.findOne({ username: req.params.username }).select('username email follows followers aboutme avatar score blogScore likeScore linkScore').exec((err, user) => {
                // Check if error was found
                if (err) {
                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                } else {
                    // Check if user was found in the database
                    if (!user) {
                        res.json({ success: false, message: 'Username not found.' }); // Return error message
                    } else {
                        res.json({ success: true, user: user }); // Return the public user's profile data
                    }
                }
            });
        }
    });

    /* ========
     FOLLOW ROUTE
     ======== */
    router.post('/follow', (req, res) => {
        queryOne = {'username': req.body.second},
            updateOne = {$push: {followers: req.body.first}},
            queryTwo = {'username': req.body.first},
            updateTwo = {$push: {follows: req.body.second}},
            options = {upsert: true};

        User.findOneAndUpdate(queryOne, updateOne, options, function (err, data) {
            if (err) {
                res.json({success: false, message: err}); // Return error message
            } else {
                if (!data) {
                    res.json({success: false, message: 'Username not found.'}); // Return error message
                } else {
                    User.findOneAndUpdate(queryTwo, updateTwo, options, function (err, data) {
                        if (err) {
                            res.json({success: false, message: err}); // Return error message
                        } else {
                            if (!data) {
                                res.json({success: false, message: 'Username not found.'}); // Return error message
                            } else {
                                res.json({success: true, message: 'Done'});
                            }
                        }
                    });
                }
            }
        });
    });

    /* ========
     UNFOLLOW ROUTE
     ======== */
    router.post('/unfollow', (req, res) => {
        queryOne = {'username': req.body.second},
            updateOne = {$pull: {followers: req.body.first}},
            queryTwo = {'username': req.body.first},
            updateTwo = {$pull: {follows: req.body.second}},
            options = {upsert: true};

        User.findOneAndUpdate(queryOne, updateOne, options, function (err, data) {
            if (err) {
                res.json({success: false, message: err}); // Return error message
            } else {
                if (!data) {
                    res.json({success: false, message: 'Username not found.'}); // Return error message
                } else {
                    User.findOneAndUpdate(queryTwo, updateTwo, options, function (err, data) {
                        if (err) {
                            res.json({success: false, message: err}); // Return error message
                        } else {
                            if (!data) {
                                res.json({success: false, message: 'Username not found.'}); // Return error message
                            } else {
                                res.json({success: true, message: 'Done'});
                            }
                        }
                    });
                }
            }
        });
    });

    /* ========
     LOAD FOLLOWINGS ROUTE
     ======== */
    router.post('/loadfollowings', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'Nothing to search.' }); // Return error message
        } else {
            User.find( { followers : req.body.username } , function (err,users) {
                if(err){
                    res.json({ success: false, message: err });
                }else{
                    res.json({ success: true, users: users });
                }
            }).sort({ '_id': -1 });
        }
    });

    /* ========
     LOAD FOLLOWERS ROUTE
     ======== */
    router.post('/loadfollowers', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'Nothing to search.' }); // Return error message
        } else {
            User.find( { follows : req.body.username } , function (err,users) {
                if(err){
                    res.json({ success: false, message: err });
                }else{
                    res.json({ success: true, users: users });
                }
            }).sort({ '_id': -1 });
        }
    });

    /* ========
        UPDATE USER PROFILE
        ======== */
    router.put('/updateProfile', (req, res) => {
        searchQuery = {'username': req.body.username},
            updateQuery = {'email':req.body.email,'aboutme':req.body.aboutme},
            options = {upsert: true};

        User.findOneAndUpdate(searchQuery, updateQuery, options,function (err,data) {
            if (err) {
                res.json({success: false, message: err}); // Return error message
            }else{
                res.json({ success: true, message: 'Profile Updated!' });
            }
        });
    });

    /* ========
     UPDATE USER PROFILE AVATAR
     ======== */
    router.put('/updateProfileAvatar', (req, res) => {
        searchQuery = {'username': req.body.username}, updateQuery = {'avatar':req.body.avatar}, options = {upsert: true};
        User.findOneAndUpdate(searchQuery, updateQuery, options,function (err,data) {
            if (err) {
                res.json({success: false, message: err}); // Return error message
            }else{
                res.json({ success: true, message: 'Profile Updated!' });
            }
        });
    });

    /* ========
     UPDATE USER PROFILE AVATAR
     ======== */
    router.put('/updateProfileAvatar', (req, res) => {
        searchQuery = {'username': req.body.username}, updateQuery = {'avatar':req.body.avatar}, options = {upsert: true};
        User.findOneAndUpdate(searchQuery, updateQuery, options,function (err,data) {
            if (err) {
                res.json({success: false, message: err}); // Return error message
            }else{
                res.json({ success: true, message: 'Profile Updated!' });
            }
        });
    });


    /* ========
     ADD USER SCORE
     ======== */
    router.put('/addPoint', (req, res) => {
        User.findOne( { 'username' : req.body.user } , function (err,user) {
            if(err){
                res.json({ success: false, message: err });
            }else{
                var numBlog = user.blogScore;
                var totalLinkScore = user.linkScore;
                if(totalLinkScore < numBlog * 15){
                    searchQuery = {'username': req.body.user}, updateQuery = {$inc : {'score' : req.body.point, 'linkScore' : req.body.point}}, options = {upsert: true};
                    User.findOneAndUpdate(searchQuery, updateQuery, options,function (err,data) {
                        if (err) {
                            res.json({success: false, message: err}); // Return error message
                        }else{
                            res.json({ success: true, message: 'Profile Updated!' });
                        }
                    });
                }else{
                    res.json({ success: true, message: 'Profile Updated!' });
                }
            }
        })

    });


    return router; // Return router object to main index.js
}
