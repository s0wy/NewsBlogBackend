import { db,getNews} from '../database/firebase.js';
import { generate_random_url} from "../middlewares/randomNewsUrl.js";
import { collection, getDocs, addDoc,doc,updateDoc,query,where,deleteDoc,limit,orderBy,startAt} from 'firebase/firestore/lite';
import { translitForCat } from "../middlewares/transiltForSearch.js"
import  jwt  from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();


export async function getNewsR(req,res) {
    const {limit: limited} = req.query;
    const {page: pages} = req.query;
    const limitNum = parseInt(limited);
    const page = parseInt(pages);
    if(!limitNum || !page) {
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
         const q1 = query(
            collection(db,'news'),
            orderBy('id', 'desc'),
            limit(1));
            const querySnapshot1 = await getDocs(q1);;
            const listOfNews1 = querySnapshot1.docs.map(doc => doc.data());

         const q = query(
         collection(db,'news'),
         orderBy('id', 'desc'),
         startAt(listOfNews1[0].id - (page * 10 - 10)),
         limit(limitNum));

         const querySnapshot = await getDocs(q);;
         const listOfNews = querySnapshot.docs.map(doc => doc.data());
         res.status(200).send({
             status: "SUCCESS",
             news: listOfNews
         })
       
    } 
}
export async function getNewsCat(req,res) {
    const {category} = req.query;
    const converted = translitForCat(category);
    const result = converted.charAt(0).toUpperCase() + converted.slice(1)
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
}
export async function postNews(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
          
        }
    });
    if(!req.body.newsUrl) {
        const newsId = generate_random_string(9);
        const q = query(
            collection(db,'news'),
            orderBy('id', 'desc'),
            limit(1));
   
            const querySnapshot = await getDocs(q);;
            const listOfNews = querySnapshot.docs.map(doc => doc.data());
    
    try {
        if(req.body.newsId === "" || req.body.newsId === 0 || req.body.newsId === undefined || req.body.newsUrl === undefined ||
        req.body.newsUrl === "" || req.body.createdAt === "" || req.body.createdAt === undefined) {
            await addDoc(collection(db,'news'),{
                newsId: newsId,
                newsContent: req.body.newsContent,
                categoryName: req.body.categoryName,
                newsUrl: generate_random_url(req.body.categoryName,newsId),
                title: req.body.title,
                subTitle: req.body.subTitle,
                titleImageUrl: req.body.titleImageUrl,
                id: listOfNews[0].id+1
                
                
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
                    id: listOfNews[0].id+1
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
    
}
export async function patchNews(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
        }
    })
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
    
}
export async function deleteNews(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
        }
    })
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
}
export async function putNews(req,res) {
    res.status(404).send({
        status: "Not Found"
    })
}
export async function optionsNews(req,res) {
    res.status(404).send({
        status: "Not Found"
    })
}
