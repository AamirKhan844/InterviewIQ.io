import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        message: "No token! Kindly login again",
        success: false,
      });
    }
    const tokenId = jwt.verify(token, process.env.JWT_SECRET);
    console.log(tokenId);
    if (!tokenId) {
      return res.status(400).json({
        message: "Invalid token Id",
        success: false,
      });
    }
    req.userId = tokenId.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
