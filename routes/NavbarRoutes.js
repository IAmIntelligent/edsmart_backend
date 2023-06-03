const express = require("express")
const router = express.Router()
const NavbarLink = require("../models/NavbarLink")

// Create a new navbar link
router.post("/", async (req, res) => {
    try {
        const { title, url } = req.params
        const createdNavBar = await NavbarLink({ title, url }).save()
        res.status(201).json(createdNavBar)
        console.log(title,url)
    } catch (error) {
        console.error("Uploading Erro", error)
        res.status(500).json({ error: "Server Error" })
    }
})

router.get("/", async (req, res) => {
    try {
        const allCreatedLinks = await createdNavBar.find()
        res.json(allCreatedLinks)
    } catch (error) {
        console.error('Navbar receiving error:', error);
        res.status(500).json({ error: "Server Error" })
    }
})

module.exports = router