const { model, Schema } = require("mongoose");

const carsSchema = new Schema({
  model: { type: String, required: [true, "db validation. model is required"] },
  color: { type: String, default: "black" },
  price: { type: Number, required: [true, "db validation. price is required"] },
  fuel: { type: String, default: "gas" },
});

module.exports = model("cars", carsSchema);
