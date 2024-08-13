import express from "express";
import http from "http";
import cors from "cors";
import Baker from "../controller/baker.js";
import Biscuit from "../controller/biscuit.js";
import { client, connectDB } from "../db.js";
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
    this.db = undefined;
    this.baker = null;
    this.registerMiddleware();
    this.registerRoutes();
  }

  /**
   * Starts the server. Returns a promise that resolves if successful. Promises are used
   * here because starting the server takes some time and we want to know when it
   * is done (and if it worked).
   *
   * @returns {Promise<void>}
   */
  start() {
    return new Promise(async (resolve, reject) => {
      console.info("Server::start() - start");
      if (this.server !== undefined) {
        console.error("Server::start() - server already listening");
        reject(new Error("Server is already running."));
      } else {
        try {
          await connectDB();
          this.db = client.db("BaKing");
          console.info("Server::start() - Database connected");
        } catch (err) {
          console.error(
            `Server::start() - Database connection ERROR: ${err.message}`
          );
          reject(
            new Error(
              "Failed to connect to the database. Server will not start."
            )
          );
          return;
        }
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
    return new Promise(async (resolve, reject) => {
      if (this.server === undefined) {
        console.error("Server::stop() - ERROR: server not started");
        reject(new Error("Server is not running."));
      } else {
        await client.close();
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
    this.express.get("/login/:user", this.login);
    this.express.get("/plan/:num_portion", this.plan);
    this.express.post("/modify", this.modify);
    this.express.post("/adjust", this.adjust);
  }

  // user login
  login = async (req, res) => {
    try {
      const { uid } = req.params;
      const users = this.db.collection("Users");
      const user = await users.findOne({ uid: uid });
      let oil, flour, sugar, liquid, berry;
      if (user) {
        oil = new Oil(user.biscuit.oil.name, user.biscuit.oil.amount);
        flour = new Flour(user.biscuit.flour.name, user.biscuit.flour.amount);
        sugar = new Sugar(user.biscuit.sugar.name, user.biscuit.sugar.amount);
        liquid = new Liquid(
          user.biscuit.liquid.name,
          user.biscuit.liquid.amount
        );
        berry = new Berry(user.biscuit.berry.name, user.biscuit.berry.amount);
        this._baker = new Baker(
          uid,
          new Biscuit(oil, flour, sugar, liquid, berry)
        );
      } else {
        oil = new Oil();
        flour = new Flour();
        sugar = new Sugar();
        liquid = new Liquid();
        berry = new Berry();
        this._baker = new Baker(
          uid,
          new Biscuit(oil, flour, sugar, liquid, berry)
        );
        users.insertOne(this._baker);
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

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
      let { sugar, oil } = req.body;
      sugar = parseFloat(sugar);
      oil = parseFloat(oil);
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
      let { sweetness, texture, milkiness } = req.body;
      sweetness = parseInt(sweetness);
      texture = parseInt(texture);
      milkiness = parseInt(milkiness);
      let amount = this.baker.biscuit.adjust_portion(sweetness, texture);
      let tastes = {
        sweetness: sweetness,
        texture: texture,
        milkiness: milkiness,
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
