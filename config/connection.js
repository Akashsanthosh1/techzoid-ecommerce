const express = require("express")
const mongoose = require("mongoose")
const db=mongoose.connection;

mongoose.connect("mongodb+srv://akashsanthosh271:Akashs%401999@cluster0.zotbq5s.mongodb.net/testdb", {
  useNewUrlParser: "true",
  useUnifiedTopology:"true"
})
 
db.on("error", err => {
  console.log("err", err)
})

db.once('open', () => {
  console.log("mongoose is connected")
})

module.exports=db;