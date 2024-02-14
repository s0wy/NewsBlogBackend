import {jwt} from 'jsonwebtoken'
const expressJwt = require('express-jwt');

const secretKey = 'your_secret_key';

// Middleware для проверки JWT токена
export const checkJwt = expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
});