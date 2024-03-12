import { db,getUsers} from '../database/firebase.js';
import { collection, getDocs,doc,updateDoc,query,where} from 'firebase/firestore/lite';
import  jwt  from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();



export async function getAccInfo(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
        }
 })
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const accInfo = querySnapshot.docs.map(doc => doc.data());
        res.status(200).send({
            status: "SUCCESS",
            accInfo: accInfo
        })
      
};

export async function postAuth(req,res) {
    const userList = await getUsers(db);
    try {
        userList.forEach(user =>  {
            if (user.login === req.body.login &&
                 user.password === req.body.password) { 
                    const token = jwt.sign({ username: user.login }, process.env.secretKey, { expiresIn: '100h' });
                    res.status(200).send({
                        status: "SUCCESS",
                        token: token
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
}
export async function postCheckAuth(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            return res.status(200).json({ message: 'success' });
        }
 })
}

export async function changePassword(req,res) {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            
        }
    })
    const q = query(collection(db, "users"), where("login", "==", req.body.login));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async ({id}) =>{ 
      try {
        const accField = doc(db,'users',id)
            await updateDoc(accField, {
               password: req.body.password
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
    })};
