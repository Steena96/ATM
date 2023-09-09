import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.get("/getCustomers", async (req, res) => {
  let collection = await db.collection("Customers");
  let results = await collection.find({}).toArray();
  res.type("application/json");
  res.send(results).status(200);
});

router.get("/getAtmCash", async (req, res) => {
  let collection = await db.collection("ATM_Cash");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.post("/updateAtmCash", async (req, res) => {
  let collection = await db.collection("ATM_Cash");
  if (Array.isArray(req.body.amount)) {
    for (const item of req.body.amount) {
      const { denomination, number } = item;
      const result = await collection.updateOne(
        { "amount.denomination": denomination },
        { $set: { "amount.$.number": number, total_cash: req.body.total_cash } }
      );
    }
  }
  res.send("").status(200);
});

router.post("/authenticate", async (req, res) => {
  const { accNO, pinNumber } = req.body[0];
  let collection = await db.collection("Customers");
  let user = await collection.findOne({ accNO, pinNumber });
  if (user) {
    // User with correct credentials found
    res.status(200).send("exist");
  } else {
    // User not found or incorrect password
    res.status(404).send("not exist");
  }
});

router.post("/getAccountBalance", async (req, res) => {
  const { accNO } = req.body[0];
  let collection = await db.collection("Customers");
  let user = await collection.findOne({ accNO });
  if (user) {
    // User with correct credentials found
    res.status(200).send(user);
  } else {
    // User not found or incorrect password
    res.status(404).send("not exist");
  }
});

router.post("/updateAccountBalance", async (req, res) => {
  const body = req.body.accNO;
  let collection = await db.collection("Customers");
  let user;
  if (req.body) {
    const { accNO, accountBalance } = req.body;
    user = await collection.updateOne(
      { accNO: accNO },
      { $set: { accountBalance: accountBalance } }
    );
  }
  res.send(user).status(200);
});

export default router;
