import jwt from "jsonwebtoken";

// Function to create JWT token
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  // Sign the token with the payload and secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w" });

  return token;
};

export default generateToken;
