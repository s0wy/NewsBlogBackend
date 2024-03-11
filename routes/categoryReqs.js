import { db,getCategory} from '../database/firebase.js';
import {generate_random_urlForCat,translit} from "../middlewares/randomNewsUrl.js";
import { collection, getDocs,doc,updateDoc,query,where,deleteDoc,limit,arrayUnion} from 'firebase/firestore/lite';
import  jwt  from "jsonwebtoken"
import dotenv from "dotenv";
import { generate_random_string } from '../middlewares/randomId.js';
dotenv.config();


export async function getCat(req,res) {
    const {limit: limited} = req.query;
    let limitNum = parseInt(limited);
    if(!limitNum) {
        const categoryList = await getCategory(db);
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
       
    }
};

export async function postCat(req, res){
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            res.status(404).send({
                status: "Not found"
            })
        }   
    })
};

export async function patchCat(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            res.status(404).send({
                status: "Not found"
            })
        }   
    })
    res.status(404).send({
        status: "Not Found"
    })
    
    // const token = req.headers.authorization.split(' ')[1]; 
    // jwt.verify(token, process.env.secretKey, (err, decoded) => {
    //     if (err) {
    //         return res.status(401).json({ message: 'Invalid token' });
    //     } else {
    //     }
    // })
    // const q = query(collection(db, "category"), where("categoryId", "==", req.body.categoryId));

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach(async ({id}) => {
    //   try {
    //     const categoryField = doc(db,'category',id);
    //     await updateDoc(categoryField, {
    //         categoryLink: req.body.categoryLink,
    //         categoryName: req.body.categoryName
    //     });
        
    //     res.status(200).send({
    //         status: "SUCCESS"
    //     })
    // } catch (error) {
    //     console.error("Ошибка при добавлении объекта:", error);
    //     res.status(500).send({
    //         status: "Internal Error"
    //     })
    // }
    // });

}
export async function deleteCat(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            res.status(404).send({
                status: "Not found"
            })
        }   
    })
    res.status(404).send({
        status: "Not Found"
    })
    // const token = req.headers.authorization.split(' ')[1]; 
    // jwt.verify(token, process.env.secretKey, (err, decoded) => {
    //     if (err) {
    //         return res.status(401).json({ message: 'Invalid token' });
    //     } else {
    //     }
    // })
    // const q = query(collection(db, "category"), where("categoryId", "==", req.body.categoryId));

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach(async ({id}) => {
    //   try {
    //     await deleteDoc(doc(db,'category',id));
        
    //     res.status(200).send({
    //         status: "SUCCESS"
    //     })
    // } catch (error) {
    //     console.error("Ошибка при добавлении объекта:", error);
    //     res.status(500).send({
    //         status: "Internal Error"
    //     })
    // }
    // });
}
export async function putCat(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
        }
    })
    const categoryTranslitName = translit(req.body.categoryName);
    const newCategory = {
        categoryId: generate_random_string(9),
        categoryLink: generate_random_urlForCat(req.body.categoryName),
        categoryName: req.body.categoryName,
        categoryTranslitName: categoryTranslitName
    }
    try {
        await updateDoc(doc(db,'category',"vzN6ranpGrG4SZfCMsvb"),{
            categories: 
                arrayUnion(newCategory)
    })
    res.status(200).send({
        status: "SUCCESS"
    })
            
    }
         catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send({
            status: "Internal Error"
        })
    }
}