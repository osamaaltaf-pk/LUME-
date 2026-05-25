export const validateSignUp = (req, res, next) => {

  const { username, password, email } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password atleast be 6 character long" });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email" })
  }

  next();
}

export const validateLogin = (req, res, next) => {

  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json({ message: "All fields are required" })
  }

  next();
}

// export default { validateSignUp, validateLogin }