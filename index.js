import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { collection, getDocs, addDoc,doc,updateDoc,query,where,deleteDoc} from 'firebase/firestore/lite';
import { db, getCategory,getUsers} from './database/firebase.js';
const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Разрешенный источник запросов
    methods: 'GET, POST', // Допустимые методы запросов
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}))

//

app.get('/category',async (req,res)=> {
    const categoryList = await getCategory(db);
    res.send(categoryList);

});

//

app.post('/category', async (req, res) => {
    try {
        await addDoc(collection(db,'category'),{
            categoryId: req.body.categoryId,
            categoryLink: req.body.categoryLink,
            categoryName: req.body.categoryName
        });
        
        res.status(200).send("Объект успешно добавлен");
    } catch (error) {
        console.error("Ошибка при добавлении объекта:", error);
        res.status(500).send("Ошибка сервера");
    }
}); 

//

app.patch('/category/', async(req,res) => {

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
        res.status(500).send("Denied");
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
        res.status(500).send("Denied");
    }
    });
})

app.put('/category', async(req,res) => { 
    res.status(404).send("Not Found");
});
app.options('/category', async(req,res) => { 
    res.status(404).send("Not Found");
});


//

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


app.listen(3000);
