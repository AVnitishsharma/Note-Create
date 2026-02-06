const express = require("express")
const noteModel = require("./model/note.model")
const cors = require("cors")
const path = require("path")

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static("./src/public"))



app.post("/notes",async (req,res)=>{
  const {title, description} = req.body

  const notes = await noteModel.create({
    title,description
  })

  res.status(201).json({
    message:"note created",
    notes
  })
})

app.get("/notes", async(req,res)=>{
  const notes = await noteModel.find()

  res.status(200).json({
    message:"all notes fetched",
    notes
  })
})

app.delete("/notes/:id", async (req,res)=>{
  const id = req.params.id

  await noteModel.findByIdAndDelete(id)

  res.status(204).json({
    message:"note is deleted"
  })
})

app.patch("/notes/:id", async (req,res)=>{
  const id = req.params.id
  const {description, title} = req.body

  await noteModel.findByIdAndUpdate(id,{description, title})

  res.status(200).json({
    message:"note updated"
  })
})

app.use("*name", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public","index.html")
  );
});

module.exports = app