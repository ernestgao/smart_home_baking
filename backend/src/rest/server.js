import express from "express";
import http from "http";
import cors from "cors";
import Baker from "../controller/baker.js";
import Biscuit from "../controller/biscuit.js";
import mgdb from "../db.js";
import connectSerial from "../serialConnection.js";
import axios from "axios";
import { Server as socketIo } from "socket.io";
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
          const serialPortPath = "/dev/cu.usbmodem101"; //根据电脑更改接口地址
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
          },
        });

        this.io.on("connection", (socket) => {
          console.info("New client connected");
          socket.on("disconnect", () => {
            console.info("Client disconnected");
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
      // console.log(data);
      this.io.emit("data", data);
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
    this.express.post("/voice-command", this.handleVoice);
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
        this._baker._biscuit.plan();
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

  handleVoice = async (req, res) => {
    const apiKey = "5f7846f0daba4259abc28c62a727de1f";
    const apiEndpoint =
      "https://baking-yummy.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2024-08-01-preview";

    const userMessage = req.body.message;
    const senderId = req.body.sender || "default";

    try {
      // Send message to Rasa
      const rasaResponse = await axios.post(
        `http://127.0.0.1:5005/webhooks/rest/webhook`,
        {
          sender: senderId,
          message: userMessage,
        }
      );
      
      // Process Rasa's response
      let botMessages = "";
      let commands = [];  // Collect command-based responses

      rasaResponse.data.forEach((response) => {
        // Check if response is a command response (based on "is_command": true)
        if (response.custom && response.custom.is_command) {
          commands.push({
            command: response.custom.command,
            parameters: response.custom.parameters
          });
          botMessages += (response.custom.message || "") + "\n";
          if (response.custom.command === "去皮") {
            // Send tare command to the Arduino
            if (this.serial && this.serial.isOpen) {
              this.serial.write("TARE\n", (err) => {
                if (err) {
                  console.error("Error sending tare command to Arduino:", err);
                } else {
                  console.info("Tare command sent to Arduino.");
                }
              });
            } else {
              console.error("Serial connection not open. Cannot send tare command.");
            }
          }
        } else {
          // Collect regular messages
          botMessages += (response.text || "") + "\n";
        }
      });

      botMessages = botMessages.trim(); // Clean up any trailing newline characters

      if (botMessages == "No Response") {
        try {
          // Send request to Azure OpenAI
          const OpenAIresponse = await axios.post(
            apiEndpoint,
            {
              messages: [
                {
                  role: "system",
                  content:
                    'Your name is Yummy and you are an AI assistant in Chinese that assist users in baking cranberry cookie. Kindly provide response in Chinese within 100 chinese characters limit. Only answer questions related to cranberry cookie and the baking procedure, otherwise respond "对不起我无法回答". If the user asks you to operate the application or system commands, respond "对不起我无法操作".',
                },
                { role: "user", content: userMessage },
              ],
              max_tokens: 200,
              temperature: 0.7,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
              },
            }
          );
          botMessages = OpenAIresponse.data.choices[0].message.content;
        } catch (error) {
          console.error("Error communicating with Azure OpenAI:",error.message);
          if (!res.headersSent) {
            return res.status(500).json({ error: "Failed to communicate with Azure OpenAI" });
          }
        }
      }
      if (!res.headersSent) {
        return res.json({ 
          messages: botMessages || null,
          commands: commands.length > 0 ? commands : null
         });
      }
    } catch (error) {
      console.error("Error communicating with Rasa:", error);
      if (!res.headersSent) {
        return res.status(500).json({ error: "Failed to communicate with Rasa server." });
      }
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
