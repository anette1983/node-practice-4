const carsModel = require("../models/carsModel");
class CarsService {
  async getAllCars() {
    const cars = await carsModel.find({});
    if (!cars) {
      return null;
    }
    return cars;
  }
}

module.exports = new CarsService();
