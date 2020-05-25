import * as functions from "firebase-functions";

// Express
import * as express from "express";
import * as cors from "cors";

// Most Basic HTTP Function
export const basicHTTP = functions.https.onRequest((req, res) => {
  const name = req.query.name;

  if (!name) {
    res.status(400).send("No name was provided!");
  }

  res.send(`Hello ${name}`);
});

// Custom Middleware
// const auth = (req: any, res: any, next: any) => {
//   if (!req.header.authorization) {
//     res.status(401).send("Unauthorized action!");
//   }

//   next();
// };

// Multi Route ExpressJS HTTP Function
const app = express();
app.use(cors({ origin: true }));
// app.use(auth);

app.get("/example", (req, res) => {
  res.send("Example Route");
});

export const api = functions.https.onRequest(app);
