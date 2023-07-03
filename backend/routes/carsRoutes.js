// /api/v1/cars
const carsController = require("../controllers/CarsController");
const carsRouter = require("express").Router();
const rolesMidleware = require("../middlewares/rolesMidleware");

// додати машину

carsRouter.post(
    "/cars",
    (req, res, next) => {
        console.log("joi");
        next();
    },
    carsController.add
);
// отримати всі

carsRouter.get(
    "/cars",
    rolesMidleware(["USER", "CUSTOMER"]),
    carsController.getAll
);
// отримати одну

// ['ADMIN', 'MODERATOR', 'CUSTOMER', 'USER']

carsRouter.get("/cars/:id", carsController.getOne);
// обновити

carsRouter.put("/cars/:id", carsController.update);
// видалити

carsRouter.delete("/cars/:id", carsController.remove);

module.exports = carsRouter;
