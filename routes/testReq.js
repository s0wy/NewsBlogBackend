import { db} from '../database/firebase.js';
import { generate_random_string } from '../middlewares/randomId.js';
import { generate_random_url} from "../middlewares/randomNewsUrl.js";
import { collection, getDocs,doc,updateDoc,query,where,deleteDoc,limit,arrayUnion,orderBy,addDoc} from 'firebase/firestore/lite';
import  jwt  from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();



export async function getTest(req,res) {
    const {limit: limited} = req.query;
    let limitNum = parseInt(limited);
    if(!limitNum) {
        const testCol = collection(db, 'tests');
        const testSnapshot = await getDocs(testCol);
        const testList = testSnapshot.docs.map(doc => doc.data());
        res.status(200).send({
            status: "SUCCESS",
            categories: testList
        })
      
        
    }
    else if(limitNum == 0) {
        res.status(401).send({
            status: "Syntax mistake"
        })
    }
    else {
        const q = query(collection(db,'tests'),limit(limitNum));
        const querySnapshot = await getDocs(q);;
        const listOfTest = querySnapshot.docs.map(doc => doc.data());
        res.status(200).send({
            status: "SUCCESS",
            categories: listOfTest
        })
       
    }
};
export async function postTest(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
          
        }
    });
    if(!req.body.testUrl) {
        const testId = generate_random_string(9);
        const q = query(
            collection(db,'tests'),
            orderBy('id', 'desc'),
            limit(1));
   
            const querySnapshot = await getDocs(q);;
            const listOfTests = querySnapshot.docs.map(doc => doc.data());
    
    try {
        const searchTitle = req.body.titleForSearch;
        const arrayOfSearchTitle = searchTitle.split(" ");
        const categoryName = "Тесты";
        if(req.body.testId === "" || req.body.testId === 0 || req.body.testId === undefined || req.body.testUrl === undefined ||
        req.body.testUrl === "") {
            await addDoc(collection(db,'tests'),{
                testId: testId,
                testContent: req.body.testContent,
                categoryName: categoryName,
                testUrl: generate_random_url(categoryName,testId),
                title: req.body.title,
                titleForSearch: arrayOfSearchTitle,
                id: listOfTests[0].id+1,
                settings: req.body.settings  
                
        });
        await addDoc(collection(db,'testResults'),{
            testId: testId,
            testResults: []
            
    });
        }
        else {
            await addDoc(collection(db,'news'),{
                testId: req.body.testId,
                testContent: req.body.testContent,
                categoryName: categoryName,
                testUrl: generate_random_url(categoryName,testId),
                title: req.body.title,
                titleForSearch: arrayOfSearchTitle,
                id: listOfTests[0].id+1,
                settings: req.body.settings 
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

export async function getTestResults(req,res) {
    try {
        const q = query(collection(db, "testResults"));
        const querySnapshot = await getDocs(q);
        const testResultList = querySnapshot.docs.map(doc => doc.data());
        res.status(200).send({
            status: "SUCCESS",
            listOfResults: testResultList
        })
    } catch (error) {
        res.status(500).send({
            status: "Internal Error"
        })
    }

}
export async function sendTestResult(req,res) { 
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
          
        }
    });
    try {
        const testResult = {
            user: req.body.user,
            procentOfCorrectAnswers: req.body.procentOfCorrectAnswers,
        }
        const q = query(collection(db,'testResults'),where("testId","==",req.body.testId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async ({id}) => {
            const testField = doc(db,'testResults',id);
            await updateDoc(testField, {
                testResults: 
                arrayUnion(testResult)
            
            })
    })
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
export async function deleteTest(req,res) {
  const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
          
        }
    });
    try {
        const q = query(collection(db, "tests"), where("testId", "==", req.body.testId));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async ({id}) => {
            await deleteDoc(doc(db,'tests',id));
            
            res.status(200).send({
                status: "SUCCESS"
            })
        })}
         catch (error) {
        
    }
}

