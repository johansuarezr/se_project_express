const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  OK,
  BAD_REQUEST,
  UNAUTH_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((error) => {
      console.error(error);
      console.log(error.name);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: error.message });
      }
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("User already exists");
        error.name = "DuplicationError";
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userCopy = user.toObject();
      delete userCopy.password;
      res.status(OK).send({ user: userCopy });
    })
    .catch((error) => {
      console.error(error);
      console.log(error.name);

      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "Email already exists" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(OK).send({ token });
    })
    .catch((error) => {
      console.error(error);
      console.log(error.name);
      if (error.message === "Incorrect email or password") {
        return res.status(UNAUTH_ERROR).send({ message: error.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: "User not Found" });
      }
      return res.status(OK).send(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      console.log(error.name);
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

export default { getCurrentUser, createUser, login, updateUser };
