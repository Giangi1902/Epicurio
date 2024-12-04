//Importo il modulo express e creo un nuovo router
const express = require('express');
const router = express.Router();
//Importo User e Post da userDetails, i quali rappresentano i dettagli degli utenti e dei post
const { User, Ingredient, Pantry } = require('../serverDetails');


router.post("/signup", async (req, res) => {
    const { username, password, expoPushToken, orariopranzo, orariocena } = req.body;
    try {
        const exist = await User.findOne({ username: username });
        if (exist) {
            res.json("esiste");
        } else {
            const newUser = await User.create({
                username: username,
                password: password,
                token: expoPushToken,
                orario_pranzo: orariopranzo,
                orario_cena: orariocena
            });

            await Pantry.create({ idUtente: newUser._id });
            res.json("ok");
        }
    } catch (e) {
        console.log(e);
        res.status(500).json("Errore del server");
    }
});


router.get("/login/:username/:password", async (req, res) => {
    const { username, password } = req.params;
    try {
        const user = await User.findOne({ username: username, password: password });
        if (user) {
            res.json({
                status: "ok",
                orario_pranzo: user.orario_pranzo,
                orario_cena: user.orario_cena
            });
        } else {
            res.json("nonesiste");
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/getInfo/:username", async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username: username })
        if (user) {
            res.json(user)
        }
        else {
            res.json("nonesiste")
        }
    }
    catch (e) {
        console.log(e)
    }
})

router.delete("/deleteAccount/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username })
        if (user) {
            await User.deleteOne({ username: username })
            res.json("ok")
        }
        else {
            res.json("no")
        }
    }
    catch (e) {
        console.log(e)
    }
})

//Esporto il router per poterlo utilizzare in altri file
module.exports = router;