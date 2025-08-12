import jwt from "jsonwebtoken";

export function verifyTokenMiddleware(req, res, next) {
  const token = req.cookies.token;  


  console.log(token)

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
}
