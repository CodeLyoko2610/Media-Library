//-------------------Create the route handler-------------------------
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
//Bring in Models-----------------------
var bookSchema = require('../models/bookSchema');
var userSchema = require('../models/userSchema');

/********************
 * Define the routes
********************/

//function for url '/' & '/books'
// function handlerURL(){
//     bookSchema.find({}, (err, bookArray) => {
//         if (err) {
//             console.log(err);
//         } else {
//             const user_email = req.cookies.user_email;
//             res.render('index', {
//                 bookArray,
//                 user_email
//             });
//             console.log("Render index page");
//         }
//     })
// }

router.get('/', (req, res, next) => {
    bookSchema.find({}, (err, bookArray) => {
        if (err) {
            console.log(err);
        } else {
            const user_email = req.cookies.user_email;
            res.render('index', {
                bookArray,
                user_email
            });
            console.log("Render index page");
        }
    })
    // next();
});

/*--------------------Books page and Book-desc--------------------*/
router.get('/books', (req, res) => {
    bookSchema.find({}, (err, bookArray) => {
        if (err) {
            console.log(err);
        } else {
            res.render('books', {
                bookArray
            });
            console.log("Render books page")
        }
    })
});

//-------------------------Sorting books---------------------------------
router.post("/books", (req, res) => {
    if (req.body.button == "AZ") {
        bookSchema.find({}).sort({
            title: 1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted a-z");
        })
    } else if (req.body.button == "ZA") {
        bookSchema.find({}).sort({
            title: -1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted z-a");
        })
    } else if (req.body.button == "AscYear") {
        bookSchema.find({}).sort({
            year: 1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted asc year");
        })
    } else if (req.body.button == "DesYear") {
        bookSchema.find({}).sort({
            year: -1
        }).exec((err, bookArray) => {
            res.render("books", {
                bookArray
            });
            console.log("Sorted des year");
        })
    }
    if (req.body.book_search != null) {

        // bookSchema.textSearch(req.body.book_search, function (err, output) {
        //     if (err) console.log(err);

        //     var inspect = require('util').inspect;
        //     console.log(inspect(output, { depth: null }));
        // });

        //manually
        var keyword = req.body.book_search.split(" ");
        var include_arr=[];
        var searchType= req.body.searchType;
        bookSchema.find({}, (err, bookArray)=>{
            if(err){
                console.log(err);
            }
            else{
                if(searchType=="all"){
                    for(var i=0; i<bookArray.length;i++){
                        for (var j=0;j<keyword.length;j++){
                            if(bookArray[i]['title'].toLowerCase().includes(keyword[j])|| bookArray[i]['author'].toLowerCase().includes(keyword[j])||bookArray[i]['language'].toLowerCase().includes(keyword[j])||bookArray[i]['year'].toString().toLowerCase().includes(keyword[j])){
                                include_arr[include_arr.length]=bookArray[i];
                            }
    
                        }
    
                    }
                }
                else{
                    for(var i=0; i<bookArray.length;i++){
                        for (var j=0;j<keyword.length;j++){
                            if(bookArray[i][searchType].toString().toLowerCase().includes(keyword[j])){
                                include_arr[include_arr.length]=bookArray[i];
                            }
    
                        }
    
                    }
                }
        if(include_arr==null){
            res.send("No book has the keyword '"+req.body.book_search+"'");
        }
        else{
            res.render("books",{bookArray:include_arr});
        //console.log(typeof include_arr);
        }
            }

        }) 


    }
    
})
//--------------------------------------------------------------------------------------
//When clicking the image, activate the link
router.get('/book-desc/:id', (req, res) => {
    bookSchema.find({}, (err, bookArray) => {
        if (err) {
            console.log(err);
        } else {
            //Taking book id when an image clicked
            var bookId = req.params.id;

            //Checking if the id is taken
            console.log(bookId);

            res.render('book-desc', {
                bookArray,
                bookId
            });
            console.log("Render book-desc page");
        }
    })
});
/*---------------------------------------------------------------------------*/
router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

/**********************
 * USER LOG-IN REGISTER
 *********************/

router.get('/register', (req, res) => {


    res.render('subs/users/register', );
});

router.post('/register', (req, res) => {
    //Send Email Confirmation
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'medialibrarylamk@gmail.com',
            pass: 'M19LamkFi'
        }
    });

    var mailOptions = {
        from: 'medialibrarylamk@gmail.com',
        to: req.body.email,
        subject: 'Media Library Confirmation',
        text: 'Congratulation! Your account has been created.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // Push New User Data to Database
    var userData = new userSchema();

    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.password = req.body.password;
    userData.confirmPassword = req.body.confirmPassword;



    userSchema.create(userData);


    res.render('subs/users/registerSuccessful');
});


router.get('/log-in', (req, res) => {


    res.render('subs/users/log-in', );
});

router.post('/log-in', (req, res) => {
    userSchema.find({}, (err, users) => {
        if (err) {
            console.log(err);
        } else {
    
            for(var i = 0; i < users.length; i++){
                if (users[i]['email'] == req.body['user_email'] &&
                users[i]['password'] == req.body['user_password'])
                {
                    res.cookie('user_email', req.body['user_email']);
                    console.log(users[i]);
                    res.redirect('/');        
                } else {
                    console.log('Please correct your email');
                    // res.redirect('/log-in');
                }
            }
            
        }
    });
});

router.get('/log-out', (req, res) => {
    res.clearCookie('user_email');
    res.redirect('/');
});

/*---------------------------------------------------------------------------*/

//Mounting the module into the main app.js
module.exports = router;