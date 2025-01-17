import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
const listEndPoints = require('express-list-endpoints');

const { Schema } = mongoose;

const thoughtSchema = new Schema({
  name: {
    type: String,
    required: false,
    minlenght: 2,
    maxlenght: 30,
    trim: true
  },
  message: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 140,
    trim: true
  },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  category: {
    type: String,
    required: false,
    enum:['Food thought', 'Project thought', 'Home thought']
  }
})

const Thought = mongoose.model("Thought", thoughtSchema);

// Resetting database

// Start defining your routes here
app.get("/", (req, res) => {
  const welcomeText = "Happy Thoughts";
  const deployedAPI = "https://project-happy-thoughts-api-3t72lksv4a-lz.a.run.app";
  const endpoints = (listEndPoints(app))

  res.send({
    body: {
      welcomeText,
      deployedAPI,
      endpoints
    }
  });
});

app.get("/thoughts", async (req, res) => {
  const { sort = 'createdAt', order = -1 } = req.query;

  try {
    const thoughtList = await Thought.find({})
      .sort({ [sort]: order })
      .limit(20)
      .exec();
     // return response
    if (thoughtList.length > 0) {
      res.status(200).json({
        success: true,
        response: thoughtList
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "No thoughts found in list"
        }
      })
    }
  } catch(err) {
    res.status(500).json({
      success: false,
      body: {
        error: err.error,
        message: "Internal Server Error"
      }
    })
  }
});

app.post("/thoughts", async (req, res) => {
  const { message, name, category } = req.body;
  const thought = new Thought({ message, name, category })
  const savedThought = await thought.save()
  try {
      res.status(201).json({
      success: true,
      response: savedThought,
      message: "created successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occured"
    });
  }
});

/* app.patch("/:thoughtId/like", async (req, res) => {
 const { thoughtId } = req.params;
 const newHeart = req.body.newHeart
  try {
    const updateHeart = await Thought.findByIdAndUpdate(thoughtId, { $inc: { heart: 1 } }, { new: true });
    res.status(200).json({
      success: true,
      response: {updateHeart},
      message: "updated successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
     });
  }
}); */

app.post("/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updateHeart = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { heart: 1 } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      response: updateHeart,
      message: "updated successfully",
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not update successfully",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
