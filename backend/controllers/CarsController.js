const carsModel = require("../models/carsModel");
const asyncHandler = require("express-async-handler");
const carsService = require("../services/CarsService");
class CarsController {
  //   async add(req, res) {
  //     const { model, price } = req.body;
  //     if (!model || !price) {
  //       return res
  //         .status(400)
  //         .json({ code: 400, message: "Error. Provide all required fields" });
  //     }
  //     const car = await carsModel.create({ ...req.body });
  //     return res.status(201).json({ code: 201, message: "success", data: car });
  //   }

  add = asyncHandler(async (req, res) => {
    const { model, price } = req.body;
    if (!model || !price) {
      res.status(400);
      throw new Error("Error. Provide all required fields");
    }
    const car = await carsModel.create({ ...req.body });
    if (!car) {
      res.status(400);
      throw new Error("Error. Unable to save");
    }
    return res.status(201).json({ code: 201, message: "success", data: car });
  });

  getAll = asyncHandler(async (req, res) => {
    // const cars = await carsModel.find({});
    const cars = await carsService.getAllCars();
    if (!cars) {
      res.status(404);
      throw new Error("Error. Unable to fetch");
    }
    return res
      .status(200)
      .json({ code: 200, message: "success", data: cars, qty: cars.length });
  });

  async getOne(req, res) {
    res.send("getOne");
  }

  async update(req, res) {
    res.send("update");
  }

  async remove(req, res) {
    res.send("remove");
  }
}

module.exports = new CarsController();
