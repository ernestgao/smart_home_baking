import express from "express";
import http from "http";
import cors from "cors";
import Baker from "../controller/baker.js";
import Biscuit from "../controller/biscuit.js";
import mgdb from "../db.js";
import connectSerial from "../serialConnection.js";
import {Server as socketIo} from 'socket.io';
const { client, connectDB } = mgdb;

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
    this.io = null;
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
          const serialPortPath = "/dev/cu.usbmodem101";
          const baudRate = 9600;
          this.serial = await connectSerial(
            serialPortPath,
            baudRate,
            (data) => {
              this.sendDataToClients({ weight: data });
            }
          );
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
        this.server = http.createServer(this.express);

        this.io = new socketIo(this.server, {
          cors: {
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
            credentials: true,
          }});

        this.io.on('connection', (socket) => {
          console.info('New client connected');
          socket.on('disconnect', () => {
            console.info('Client disconnected');
          });
        });

        this.server
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

  sendDataToClients(data) {
    if (this.io) {
      this.io.emit('data', data);
    }
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
    this.express.get("/login/:uid", this.login);
    this.express.get("/display", this.display);
    this.express.get("/plan", this.plan);
    this.express.post("/modify", this.modify);
    this.express.post("/adjust", this.adjust);
  }

  // user login
  login = async (req, res) => {
    try {
      const { uid } = req.params;
      const users = this.db.collection("Users");
      const user = await users.findOne({ _uid: `${uid}` });
      let oil, flour, sugar, liquid, berry;
      if (user) {
        oil = new Oil(user._biscuit._oil._name, user._biscuit._oil._amount);
        flour = new Flour(
          user._biscuit._flour._name,
          user._biscuit._flour._amount
        );
        sugar = new Sugar(
          user._biscuit._sugar._name,
          user._biscuit._sugar._amount
        );
        liquid = new Liquid(
          user._biscuit._liquid._name,
          user._biscuit._liquid._amount
        );
        berry = new Berry(
          user._biscuit._berry._name,
          user._biscuit._berry._amount
        );
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
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  display = (req, res) => {
    try {
      let amount = this._baker.biscuit.get_amounts();
      let tastes = this._baker.biscuit.taste_predict();
      let calorie = this._baker.biscuit.caculate_calorie();
      let results = {
        amount: amount,
        tastes: tastes,
        calorie: calorie,
      };
      res.status(200).json({ uid: this._baker._uid, result: results });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // return amount, tastes, calorie
  plan = (req, res) => {
    try {
      let amount = this._baker.biscuit.plan();
      let tastes = this._baker.biscuit.taste_predict();
      let calorie = this._baker.biscuit.caculate_calorie();
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
      let amount = this._baker.biscuit.adjust_amount(sugar, oil);
      let tastes = this._baker.biscuit.taste_predict();
      let calorie = this._baker.biscuit.caculate_calorie();
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
      let amount = this._baker.biscuit.adjust_portion(sweetness, texture);
      let tastes = {
        sweetness: sweetness,
        texture: texture,
        milkiness: milkiness,
      };
      let calorie = this._baker.biscuit.caculate_calorie();
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
