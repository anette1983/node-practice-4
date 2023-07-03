import andriy from "./js/andriy";
// import "./css/igor.css";
import "./scss/anna.scss";

console.log("Hello from WebPack!");

class User {
  #name;
  constructor(name) {
    this.#name = name;
  }
  getInfo() {
    console.log(this.#name);
  }
}
const ihor = new User("Ihor");
ihor.getInfo();
