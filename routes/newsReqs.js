import { db,getNews} from '../database/firebase.js';
import { generate_random_string } from '../middlewares/randomId.js';
import { generate_random_url,translit} from "../middlewares/randomNewsUrl.js";
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
    if(category != "") {
        const q = query(collection(db,'news'),where("categoryTranslitName","==",category));
        const querySnapshot = await getDocs(q);
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
        const searchTitle = req.body.titleForSearch;
        const arrayOfSearchTitle = searchTitle.split(" ");
        const categoryTranslitName = translit(req.body.categoryName);
        if(req.body.newsId === "" || req.body.newsId === 0 || req.body.newsId === undefined || req.body.newsUrl === undefined ||
        req.body.newsUrl === "") {
            await addDoc(collection(db,'news'),{
                newsId: newsId,
                newsContent: req.body.newsContent,
                categoryName: req.body.categoryName,
                newsUrl: generate_random_url(req.body.categoryName,newsId),
                title: req.body.title,
                titleForSearch: arrayOfSearchTitle,
                subTitle: req.body.subTitle,
                titleImageUrl: req.body.titleImageUrl,
                id: listOfNews[0].id+1,
                settings: req.body.settings,
                categoryTranslitName: categoryTranslitName
                
                
        });
        }
        else {
            await addDoc(collection(db,'news'),{
                    newsId: req.body.newsId,
                    newsContent: req.body.newsContent,
                    categoryName: req.body.categoryName,
                    newsUrl: generate_random_url(req.body.categoryName,newsId),
                    title: req.body.title,
                    titleForSearch: arrayOfSearchTitle,
                    subTitle: req.body.subTitle,
                    titleImageUrl: req.body.titleImageUrl,
                    id: listOfNews[0].id+1,
                    settings: req.body.settings,
                    categoryTranslitName: categoryTranslitName
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
export async function getSearchNews(req,res) {
    const searchTitle  = req.query.searchTitle;
    try {
        const q = query(collection(db, "news"),where("titleForSearch", "array-contains",searchTitle));
        const querySnapshot = await getDocs(q);
        const listOfNews = querySnapshot.docs.map(doc => doc.data());
        res.status(200).send({
            status: "SUCCESS",
            news: listOfNews
        })
    }
    catch(error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
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
        const categoryTranslitName = translit(req.body.categoryName);
        const searchTitle = req.body.titleForSearch;
        const arrayOfSearchTitle = searchTitle.split(" ");
        const newsField = doc(db,'news',id);
            await updateDoc(newsField, {
                newsContent: req.body.newsContent,
                categoryName: req.body.categoryName,
                title: req.body.title,
                titleForSearch: arrayOfSearchTitle,
                subTitle: req.body.subTitle,
                titleImageUrl: req.body.titleImageUrl,
                newsUrl: generate_random_url(req.body.categoryName,req.body.newsId),
                settings: req.body.settings,
                categoryTranslitName: categoryTranslitName
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
