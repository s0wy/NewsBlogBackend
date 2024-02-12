import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { collection, getDocs, addDoc,doc,updateDoc,query,where,deleteDoc,limit, getDoc} from 'firebase/firestore/lite';
import { db, getCategory,getUsers,getNews} from './database/firebase.js';
const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500','http://localhost:5173'], // Разрешенный источник запросов
    methods: 'GET, POST, PATCH, DELETE' // Допустимые методы запросов
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}))

//

app.get('/category',async (req,res)=> {
    const categoryList = await getCategory(db);
    const {limit: limited} = req.query;
    const limitNum = parseInt(limited);
    if(limitNum != 0) {

        const q = query(collection(db,'category'),limit(limitNum));
        const querySnapshot = await getDocs(q);;
        const listOfCategory = querySnapshot.docs.map(doc => doc.data());

        res.status(200);
        res.send(listOfCategory);
    }
    else if(limitNum == 0) {
        res.status(401).send("Syntax mistake")
    }
    else {
        res.status(200);
        res.send(categoryList);
    }

});

//

app.post('/category', async (req, res) => {
    try {
        await addDoc(collection(db,'category'),{
            categoryId: req.body.categoryId,
            categoryLink: req.body.categoryLink,
            categoryName: req.body.categoryName
        });
        
        res.status(200).send("Success");
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send("Internal error");
    }
}); 

//

app.patch('/category', async(req,res) => {

    const q = query(collection(db, "category"), where("categoryId", "==", req.body.categoryId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async ({id}) => {
      try {
        const categoryField = doc(db,'category',id);
        await updateDoc(categoryField, {
            categoryLink: req.body.categoryLink,
            categoryName: req.body.categoryName
        });
        
        res.status(200).send("Success");
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send("Internal error");
    }
    });

})

//

app.delete('/category', async(req,res) => {
    const q = query(collection(db, "category"), where("categoryId", "==", req.body.categoryId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async ({id}) => {
      try {
        await deleteDoc(doc(db,'category',id));
        
        res.status(200).send("Success");
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send("Internal error");
    }
    });
})

app.put('/category', async(req,res) => { 
    res.status(404).send("Not Found");
});
app.options('/category', async(req,res) => { 
    res.status(404).send("Not Found");
});


///

app.post('/auth', async (req, res) => {
   const userList = await getUsers(db);
    try {
        userList.forEach(user =>  {
            if (user.login === req.body.login &&
                 user.password === req.body.password) {
                    res.status(200).send("Успешная авторизация");
                }
            else {
                throw new Error("Access denied")
            }
        })
       
    } catch (error) {
        res.status(403).send(error.message);
    }
});

///

app.get('/news',async (req,res)=> {
    const newsList = await getNews(db);
    const {limit: limited} = req.query;
    const limitNum = parseInt(limited);
    if(limitNum != 0) {

        const q = query(collection(db,'news'),limit(limitNum));
        const querySnapshot = await getDocs(q);;
        const listOfNews = querySnapshot.docs.map(doc => doc.data());

        res.status(200);
        res.send(listOfNews);
    }
    else if(limitNum == 0) {
        res.status(401).send("Syntax mistake")
    }
    else {
        res.status(200);
        res.send(newsList);
    }

});

//

app.post('/news', async (req, res) => {
    try {
        await addDoc(collection(db,'news'),{
                newsImage: req.body.newsImage,
                newsSubtitle: req.body.newsSubtitle,
                newsId: req.body.newsId,
                newsTitle: req.body.newsTitle,
                newsCategory: req.body.newsCategory,
                newsContent: req.body.newsContent
        });
        
        res.status(200).send("Success");
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send("Internal error");
    }
}); 

//

app.patch('/news', async(req,res) => {

   
    const q = query(collection(db, "news"), where("newsId", "==", req.body.newsId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async ({id}) => {
      try {
        const categoryField = doc(db,'news',id);
        await updateDoc(categoryField, {
            newsImage: req.body.newsImage,
            newsSubtitle: req.body.newsSubtitle,
            newsId: req.body.newsId,
            newsTitle: req.body.newsTitle,
            newsCategory: req.body.newsCategory,
            newsContent: req.body.newsContent
        });
        
        res.status(200).send("Success");
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send("Internal error");
    }
    });

})

//

app.delete('/news', async(req,res) => {
    const q = query(collection(db, "news"), where("newsId", "==", req.body.newsId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async ({id}) => {
      try {
        await deleteDoc(doc(db,'news',id));
        
        res.status(200).send("Success");
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send("Internal error");
    }
    });
})

app.put('/news', async(req,res) => { 
    res.status(404).send("Not Found");
});
app.options('/news', async(req,res) => { 
    res.status(404).send("Not Found");
});


app.listen(3000);
