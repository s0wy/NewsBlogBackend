import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { upload} from './middlewares/multer.cjs';
import { getCat,patchCat,postCat,deleteCat,putCat } from "./routes/categoryReqs.js";
import { getNewsR,postNews,patchNews,deleteNews,putNews,optionsNews,getNewsCat,postSearchNews } from "./routes/newsReqs.js";
import { postAuth,postCheckAuth } from "./routes/authReq.js";
import dotenv from "dotenv";
import { postUpload } from "./routes/uploadReq.js";
const app = express();



dotenv.config();
app.use(cors({
    origin: ['http://127.0.0.1:5500','http://localhost:5173','https://supervision-nine.vercel.app'], // Разрешенный источник запросов
    methods: 'GET, POST, PATCH, DELETE' // Допустимые методы запросов
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}))

// category reqs

app.get('/category',getCat);
app.post('/category',postCat); 
app.patch('/category', patchCat)
app.delete('/category',deleteCat)
app.put('/category', putCat); 
app.options('/category', postCat);

// auth reqs

app.post('/auth',postAuth);
app.post('/checkAuth', postCheckAuth);

// news reqs

app.get('/news',getNewsR);
app.get('/news-category',getNewsCat);
app.post('/news', postNews); 
app.post('/searchNews',postSearchNews);
app.patch('/news', patchNews)
app.delete('/news', deleteNews)
app.put('/news', putNews);
app.options('/news', optionsNews);

// upload Images

app.post('/test-upload', upload, postUpload)
app.listen(3000);