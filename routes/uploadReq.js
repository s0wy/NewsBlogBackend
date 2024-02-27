import { uploadImage} from '../database/firebase.js';

export async function postUpload(req,res){ 
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
        res.status(500).send({
            status: "Internal Error"
        })
    }
}