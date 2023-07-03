const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "db validation. email is required"],
    },
    password: {
        type: String,
        required: [true, "db validation. password is required"],
    },
    name: { type: String, default: "Sandra Bullok" },
    token: { type: String, default: null },
    roles: [
        {
            type: String,
            ref: "roles",
        },
    ],
});

module.exports = model("user", userSchema);
