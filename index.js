const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main().then(() => {
        console.log("connection is successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//Index Route
app.get("/chats", async (req, res, next) => {
    try {
        let chats = await Chat.find();
        // console.log(chats);
        res.render("index.ejs", {chats});
    } catch (error) {
        next(new ExpressError("Failed to retrieve chats", 500));
    }
});

//New Route
app.get("/chats/new", (req, res, next) => {
    // throw new ExpressError("This is a forced error", 500);
    res.render("new.ejs");
});

//Create Route
app.post("/chats", wrapAsync(async (req, res, next) => {
    let {from, to, msg} = req.body;
    if(!from || !to || !msg){
        throw new ExpressError("All fields are required", 400);
    }
    let newChat = new Chat ({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    await newChat.save().then((res) => {
        console.log("chat was saved");
    })
    res.redirect("/chats");
}));

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

// show route
app.get("/chats/:id", wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat){
        next (new ExpressError("Chat Not Found", 404));
    }
    res.render("edit.ejs", {chat});
}));

// edit route
app.get("/chats/:id/edit", wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
}));

// Update route
app.put("/chats/:id", wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, {runValidators: true, new: true});
    console.log(updatedChat);
    res.redirect("/chats");
}));

// destroy route
app.delete("/chats/:id", async(req, res) => {
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
})

app.get("/", (req, res) => {
    res.send("root is working");
});

// error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).send(message);
});

app.listen("8080", () => {
    console.log("app is listening to port 8080");
});
