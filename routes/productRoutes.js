const express = require("express");
const auth = require("../models/authModel");
const product = require("../models/productModel");
const router = express.Router();

router.get("/get", (req, res) => {
    try {
        product.find((err, data) => {
            if (err) {
                return res.status(400).send({ msg: "Error while retrieving data" });
            }
            res.status(200).send(data);
        });
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.get("/searchProduct/:key", async (req, res) => {
    let result = await product.find({
        "$or": [
            {
                title: { $regex: req.params.key }
            },
            {
                price: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            },
        ]
    });
    res.send(result);
});

router.get('/getOne/:dataID', (req, res) => {
    try {
        product.findOne({ id: req.params.dataID }, (err, data) => {
            if (err) {
                return res.status(400).send({ msg: 'Error while retrieving an data. Please check the data' })
            }

            res.status(200).send(data);
        })
    } catch (error) {
        res.status(500).send({
            msg: 'Internal Server Error'
        })
    }
});

router.post("/create", auth.authenticateUser, async (req, res) => {
    try {
        const payload = req.body;
        const newData = new product(payload);
        await newData.save((err, data) => {
            if (err) {
                return res.status(400).send({ msg: "Error while adding data" });
            }
            res.status(201).send({ dataId: data._id, msg: "Product added successfully" });
        });
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error" });
        console.log(err);
    }
});

router.put("/update/:dataID", auth.authenticateUser, (req, res) => {
    try {
        product.findByIdAndUpdate({ _id: req.params.dataID }, { $set: req.body }, (err, data) => {
            if (err) {
                return res.status(400).send({ msg: "Error while updating data" });
            }
            res.status(201).send({ dataId: data._id, msg: "Data have been updated" });
        });
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

router.delete("/delete/:dataID", auth.authenticateUser, (req, res) => {
    try {
        product.deleteOne({ _id: req.params.dataID }, (err, data) => {
            if (err) {
                return res.status(400).send("Error while deleting data");
            }
            res.status(200).send({ msg: `Data with id ${req.params.dataID} has been deleted` });
        });
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

module.exports = router;