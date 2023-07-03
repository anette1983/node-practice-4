const express = require("express");
const path = require("path");
const connectDB = require("../config/connectDB");
const bcryptjs = require("bcryptjs");
require("colors");
const errorHandler = require("./middlewares/errorHandler");
const asyncHandler = require("express-async-handler");
const { engine } = require("express-handlebars");

const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware");

const userModel = require("./models/usersModel");
const rolesModel = require("./models/rolesModel");
const sendEmail = require("./services/sendEmail");

const configPath = path.join(__dirname, "..", "config", ".env");

require("dotenv").config({ path: configPath });

const app = express();

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//set template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "backend/views");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/success", async (req, res) => {
  try {
    res.render("success", { msg: "form send success", name: req.body.userName, email: req.body.userEmail });
    await sendEmail(req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  // res.send(req.body);
});

app.use("/api/v1", require("./routes/carsRoutes"));

// Реєстрація збереження користувача в базі
// Аутентифікація порівняння даних користувача і данних в базі
// Авторизація перевірка прав доступу
// Logout вихід з системи

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    // 1. Отримаэмо поля email and password, і валідуємо;
    // 2. Шукаємо користувача в базі по email
    // 3. Якщо користувач існує, видаємо помилку
    // 4. якщо не існує то хешуємо пароль
    // 5. Реєструємо
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Error. Provide all required fields");
    }

    const user = await userModel.findOne({ email });
    const roles = await rolesModel.findOne({ value: "ADMIN" });

    // console.log(roles.value);

    if (user) {
      res.status(409);
      throw new Error("User allredy exists");
    }
    const hashPassowd = bcryptjs.hashSync(password, 10);

    const newUser = await userModel.create({
      ...req.body,
      password: hashPassowd,
      roles: [roles.value],
    });

    return res.status(201).json({ code: 201, message: "Success", email: newUser.email });
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // 1. Отримаэмо поля email and password, і валідуємо;
    // 2. Шукаємо користувача в базі по email
    // 3. Якщо користувач існує, розшифровуємо пароль
    // 4. Якщо не знайшли або не розшифрували пароль, говоримо не вірний логін або пароль
    // 5. Якщо все добре видаємо токен
    // 6. Зберігаємо користовачу поле токен

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Error. Provide all required fields");
    }

    const user = await userModel.findOne({ email });
    const isValidPassword = bcryptjs.compareSync(password, user.password);

    if (!isValidPassword || !user) {
      res.status(400);
      throw new Error("Not valid email or password");
    }

    user.token = generateToken({
      fliends: ["Oleksii", "Zachar", "Vika", "Nat"],
      id: user._id,
      roles: user.roles,
    });

    await user.save();
    return res.status(201).json({
      code: 201,
      message: "Success",
      email: user.email,
      token: user.token,
    });
  })
);
function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, "pizza", { expiresIn: "8hr" });
}

app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    // 1. Отримуэмо ID з об'єкта req
    // 2. Шукаэмо користувача по ID
    // 3. Встановлюємо йому tokem.null
    const id = req.user;
    console.log(id);
    const user = await userModel.findById(id);
    user.token = null;
    await user.save();
    return res.status(200).json({
      code: 201,
      message: "Logout success",
    });
  })
);

app.use(errorHandler);

const { PORT } = process.env;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold.italic);
});
