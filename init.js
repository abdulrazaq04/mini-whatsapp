const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main().then(() => {
        console.log("connection is successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
        from: "neha", 
        to: "priya",
        msg: "send me notes for exam",
        created_at: new Date()
    },
    {
        from: "abdul", 
        to: "razaq",
        msg: "send me exam paper",
        created_at: new Date()
    },
    {
        from: "kashif", 
        to: "razaq",
        msg: "how are you",
        created_at: new Date()
    },
    {
        from: "abdul", 
        to: "afnan",
        msg: "how are you doing",
        created_at: new Date()
    },
];

Chat.insertMany(allChats);
