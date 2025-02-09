const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", auth, userRouter);
router.use("/items", clothingRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router Is Not Found" });
});

module.exports = router;
