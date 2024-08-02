import express from "express";
import http from "http";
import cors from "cors";
import Baker from "../controller/baker.js";
import Biscuit from "../controller/biscuit.js";
import {
  Ingredient,
  Oil,
  Flour,
  Sugar,
  Liquid,
  Berry,
} from "../controller/ingredients.js";

class Server {
  constructor(port) {
    console.info(`Server::<init>( ${port} )`);
    this.port = port;
    this.express = express();
    this.server = undefined;
    let oil, flour, sugar, liquid, berry;
    oil = new Oil();
    flour = new Flour();
    sugar = new Sugar();
    liquid = new Liquid();
    berry = new Berry();
    this.baker = new Baker(
      "user",
      new Biscuit(oil, flour, sugar, liquid, berry)
    );
    this.registerMiddleware();
    this.registerRoutes();
  }

  /**
   * @param {Baker} newBaker
   */
  set baker(newBaker) {
    this._baker = newBaker;
  }

  get baker() {
    return this._baker;
  }

  /**
   * Starts the server. Returns a promise that resolves if successful. Promises are used
   * here because starting the server takes some time and we want to know when it
   * is done (and if it worked).
   *
   * @returns {Promise<void>}
   */
  start() {
    return new Promise((resolve, reject) => {
      console.info("Server::start() - start");
      if (this.server !== undefined) {
        console.error("Server::start() - server already listening");
        reject(new Error("Server is already running."));
      } else {
        this.server = this.express
          .listen(this.port, () => {
            console.info(
              `Server::start() - server listening on port: ${this.port}`
            );
            resolve();
          })
          .on("error", (err) => {
            // catches errors in server start
            console.error(`Server::start() - server ERROR: ${err.message}`);
            reject(err);
          });
      }
    });
  }

  /**
   * Stops the server. Again returns a promise so we know when the connections have
   * actually been fully closed and the port has been released.
   *
   * @returns {Promise<void>}
   */
  stop() {
    console.info("Server::stop()");
    return new Promise((resolve, reject) => {
      if (this.server === undefined) {
        console.error("Server::stop() - ERROR: server not started");
        reject(new Error("Server is not running."));
      } else {
        this.server.close(() => {
          console.info("Server::stop() - server closed");
          resolve();
        });
      }
    });
  }

  registerMiddleware() {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.raw({ type: "application/*", limit: "10mb" }));
  }

  registerRoutes() {
    this.express.get("/echo/:msg", Server.echo);
    this.express.get("/plan/:num_portion", this.plan);
    this.express.post("/modify", this.modify);
    this.express.post("/adjust", this.adjust);
  }

  // return amount, tastes, calorie
  plan = (req, res) => {
    try {
      const { num_portion } = req.params;
      let amount = this.baker.biscuit.plan(num_portion);
      let tastes = this.baker.biscuit.taste_predict();
      let calorie = this.baker.biscuit.caculate_calorie();
      let results = {
        amount: amount,
        tastes: tastes,
        calorie: calorie,
      };
      res.status(200).json({ result: results });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  modify = (req, res) => {
    try {
      const { sugar, oil } = req.body;
      let amount = this.baker.biscuit.adjust_amount(sugar, oil);
      let tastes = this.baker.biscuit.taste_predict();
      let calorie = this.baker.biscuit.caculate_calorie();
      let results = {
        amount: amount,
        tastes: tastes,
        calorie: calorie,
      };
      res.status(200).json({ result: results });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  adjust = (req, res) => {
    try {
      const { sweetness, texture, milkiness } = req.body;
      let amount = this.baker.biscuit.adjust_portion(
        sweetness,
        texture,
        milkiness
      );
      let tastes = {
        甜度: sweetness,
        口感: texture,
        奶香: milkiness,
      };
      let calorie = this.baker.biscuit.caculate_calorie();
      let results = {
        amount: amount,
        tastes: tastes,
        calorie: calorie,
      };
      res.status(200).json({ result: results });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static echo(req, res) {
    try {
      console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
      const response = Server.performEcho(req.params.msg);
      res.status(200).json({ result: response });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static performEcho(msg) {
    if (typeof msg !== "undefined" && msg !== null) {
      return `${msg}...${msg}`;
    } else {
      return "Message not provided";
    }
  }
}

export default Server;
