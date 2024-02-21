import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { collection, getDocs, addDoc,doc,updateDoc,query,where,deleteDoc,limit, serverTimestamp, orderBy,startAt, startAfter} from 'firebase/firestore/lite';
import { db,uploadImage,getCategory,getUsers,getNews} from './database/firebase.js';
import { generate_random_string } from "./middlewares/randomId.js";
import { upload} from './middlewares/multer.cjs';
import { generate_random_url } from "./middlewares/randomNewsUrl.js";
import { list } from "firebase/storage";
const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500','http://localhost:5173','https://supervision-nine.vercel.app'], // Разрешенный источник запросов
    methods: 'GET, POST, PATCH, DELETE' // Допустимые методы запросов
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}))

//

app.get('/category',async (req,res)=> {
    const {limit: limited} = req.query;
    let limitNum = parseInt(limited);
    if(!limitNum) {
        const categoryList = await getCategory(db);
        console.log("if2")
        res.status(200).send({
            status: "SUCCESS",
            categories: categoryList
        })
      
        
    }
    else if(limitNum == 0) {
        res.status(401).send({
            status: "Syntax mistake"
        })
    }
    else {
        const q = query(collection(db,'category'),limit(limitNum));
        const querySnapshot = await getDocs(q);;
        const listOfCategory = querySnapshot.docs.map(doc => doc.data());
        res.status(200).send({
            status: "SUCCESS",
            categories: listOfCategory
        })
        console.log("if1")
       
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
        
        res.status(200).send({
            status: "SUCCESS"
        })
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
        })
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
        
        res.status(200).send({
            status: "SUCCESS"
        })
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
        })
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
        
        res.status(200).send({
            status: "SUCCESS"
        })
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
        })
    }
    });
})

app.put('/category', async(req,res) => { 
    res.status(404).send({
        status: "Not Found"
    })
});
app.options('/category', async(req,res) => { 
    res.status(404).send({
        status: "Not Found"
    })
    
});


///

app.post('/auth', async (req, res) => {
   const userList = await getUsers(db);
    try {
        userList.forEach(user =>  {
            if (user.login === req.body.login &&
                 user.password === req.body.password) {
                    res.status(200).send({
                        status: "SUCCESS"
                    })
                }
            else {
                throw new Error("Access denied")
            }
        })
       
    } catch (error) {
        res.status(403).send({
            status: error.message
        })
        
    }
});

///

app.get('/news',async (req,res)=> {
    const {limit: limited} = req.query;
    const {page: pages} = req.query;
    const limitNum = parseInt(limited);
    const page = parseInt(pages);
    if(!limitNum || !page) {
        console.log("if2")
        const newsList = await getNews(db);
        res.status(200).send({
            status: "SUCCESS",
            news: newsList   
         })
    }
    else if(limitNum <= 0) {
        res.status(401).send({
            status: "Syntax mistake"
        })
    }
    else{
         console.log("if1")

         const q = query(
         collection(db,'news'),
         orderBy('createdAt', 'desc'),
         limit(limitNum));

         const querySnapshot = await getDocs(q);;
         console.log("dlina" + querySnapshot.docs.length)
         const listOfNews = querySnapshot.docs.map(doc => doc.data());
         res.status(200).send({
             status: "SUCCESS",
             news: listOfNews
         })
       
    }
    }
);

//

app.get('/news-category',async (req,res)=> {
    const {category} = req.query;
    const result = category.charAt(0).toUpperCase() + category.slice(1)
    if(category != "") {
        const q = query(collection(db,'news'),where("categoryName","==",result));
        const querySnapshot = await getDocs(q);;
        const listOfNews = querySnapshot.docs.map(doc => doc.data());
        res.status(200).send({
            status: "SUCCESS",
            news: listOfNews
        })

    }
    else {
        const newsList = await getNews(db);
        res.status(200).send({
            status: "SUCCESS",
            news: newsList   
         })
       
    }

});
//

app.post('/news', async (req, res) => {
    if(!req.body.newsUrl) {

    
    try {
        if(req.body.newsId === "" || req.body.newsId === 0 || req.body.newsId === undefined || req.body.newsUrl === undefined ||
        req.body.newsUrl === "" || req.body.createdAt === "" || req.body.createdAt === undefined) {
            const newsId = generate_random_string(9);
            await addDoc(collection(db,'news'),{
                newsId: newsId,
                newsContent: req.body.newsContent,
                categoryName: req.body.categoryName,
                newsUrl: generate_random_url(req.body.categoryName,newsId),
                title: req.body.title,
                subTitle: req.body.subTitle,
                titleImageUrl: req.body.titleImageUrl,
                createdAt: serverTimestamp()
                
                
        });
        }
        else {
            await addDoc(collection(db,'news'),{
                    newsId: req.body.newsId,
                    newsContent: req.body.newsContent,
                    categoryName: req.body.categoryName,
                    newsUrl: generate_random_url(req.body.categoryName),
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    titleImageUrl: req.body.titleImageUrl,
                    createdAt: serverTimestamp()
            });
        }
        
        res.status(200).send({
            status: "SUCCESS"
        })
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
        })
    }
}
else {
    res.status(501).send({
        status: "Not Implemented"
    })
}
}); 

//

app.patch('/news', async(req,res) => {

   
    const q = query(collection(db, "news"), where("newsId", "==", req.body.newsId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async ({id}) => {
      try {
        const newsField = doc(db,'news',id);
        await updateDoc(newsField, {
            newsI: req.body.newsImage,
            newsSubtitle: req.body.newsSubtitle,
            newsId: req.body.newsId,
            newsTitle: req.body.newsTitle,
            newsCategory: req.body.newsCategory,
            newsContent: req.body.newsContent
        });
        
        res.status(200).send({
            status: "SUCCESS"
        })
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
        })
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
        
        res.status(200).send({
            status: "SUCCESS"
        })
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
        })
    }
    });
})

app.put('/news', async(req,res) => { 
    res.status(404).send({
        status: "Not Found"
    })
});
app.options('/news', async(req,res) => { 
    res.status(404).send({
        status: "Not Found"
    })
});



app.post('/test-upload', upload, async (req, res) => {
    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer
    }
    try {
        const buildImage = await uploadImage(file, 'single'); 
        res.send({
            status: "SUCCESS",
            imageName: buildImage
        })
    } catch(err) {
        console.log(err);
        res.status(500).send({
            status: "Internal Error"
        })
    }
})


app.listen(3000);
