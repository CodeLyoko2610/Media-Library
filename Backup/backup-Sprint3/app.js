//get mongodb module
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

//output total array 
var myArray = [];
var AZArray=[];
var ZAArray=[];
var AscYearArray=[];
var DesYearArray=[];

    MongoClient.connect(url, {
        useNewUrlParser: true
    }, (err, db) => {
        if (err) throw err;
        var dbo = db.db("myBooks");
        dbo.collection("books").find({}).toArray((err, result) => {
            if (err) throw err;
            myArray = result;
            console.log(myArray[0]);
            db.close();
        });
        dbo.collection("books").find({}).sort({title: 1}).toArray((err, result) => {
            if (err) throw err;
            AZArray = result;
            console.log(AZArray[0]);
            
            db.close();
        });
        dbo.collection("books").find({}).sort({title: -1}).toArray((err, result) => {
            if (err) throw err;
            ZAArray = result;
            
            db.close();
        });
            dbo.collection("books").find({}).sort({year: 1}).toArray((err, result) => {
                if (err) throw err;
                AscYearArray = result;
                
                db.close();
            });
            dbo.collection("books").find({}).sort({year: -1}).toArray((err, result) => {
                if (err) throw err;
                DesYearArray = result;
                
                db.close();
        });
    });


/******************
 * Express NPM
 *****************/
//get express module
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//setting view engine as pug
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

/*---------------------------------------------------------------------------------------------*/

app.get('/', (req, res) => {
    var bookArray = myArray;
    res.render('home', { bookArray });
});

/*--------------------Books page and Book-desc--------------------*/
app.get('/books', (req, res) => {
    var bookArray = myArray;
    res.render('books', { bookArray });
});

//When clicking the image, activate the link
app.get('/book-desc/:id', (req, res) => {
    var bookArray = myArray;
    //Taking book id when an image clicked
    var bookId = req.params.id;
    
    //Checking if the id is taken
    console.log(bookId);
    
    res.render('book-desc', { bookArray, bookId });
});

/*---------------------------------------------------------------------------*/

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post("/books",(req,res)=>{
    var bookArray=[];
    if(req.body.button=="AZ"){
        bookArray=AZArray;
    }
    else if(req.body.button=="ZA"){
        bookArray=ZAArray;
    }
    else if(req.body.button=="AscYear"){
        bookArray=AscYearArray;
    }
    else{
        bookArray=DesYearArray;
    }
    res.render("books",{bookArray});
})
/*-------------------------------------------------------------------------------------------------------- */
app.listen(8000, (req, res) => {
    console.log("Running on localhost:3000");
})