import jwt from 'jsonwebtoken';
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("token: ", token)

        if (!token) {
            return res.status(401).json({
                mesage: "User not authenticated",
                success: false
            });
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false
            });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated;