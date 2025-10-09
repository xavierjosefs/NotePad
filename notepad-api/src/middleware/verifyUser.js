import jwt from "jsonwebtoken";

export default function verifyUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "You are not authenticated" });
  }

  jwt.verify(token, process.env.SECRET_KEY.toString(), (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.id = decoded.id;
    next();
  });
}
