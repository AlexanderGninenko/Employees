const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const prisma = new PrismaClient();

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_SECRET;

  if (!email || !password) {
    return res.status(400).json({ message: "Введите почту и пароль" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const isPasswordCorrect = user && bcrypt.compare(password, user.password);

  if (user && isPasswordCorrect && secret) {
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      token: jwt.sign({ id: user.id }, secret, { expiresIn: "7d" }),
    });
  } else {
    return res.status(400).json({ message: "Неверные данные" });
  }
};

const register = async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Введите все данные" });
  }

  const registeredUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (registeredUser) {
    return res.status(400).json({ message: "Такой пользователь уже есть" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  const secret = process.env.JWT_SECRET;

  if (user && secret) {
    res.status(201).json({
      id: user.id,
      email: user.email,
      name,
      token: jwt.sign({ id: user.id }, secret, { expiresIn: "7d" }),
    });
  } else {
    return res.status(400).json({ message: "Не удалось создать пользователя" });
  }
};

const current = async (req, res, next) => {
  return res.status(200).json(req.user);
};

module.exports = {
  login,
  register,
  current,
};
