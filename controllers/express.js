import express from "express";

const app = express();

app.get('/books',(req,res)=> {
    res.send("Hello books");
})

app.listen(3000);