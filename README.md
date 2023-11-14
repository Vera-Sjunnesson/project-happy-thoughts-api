# Project Happy Thoughts API
This is the API for my Happy Thoughts project, a version of Twitter which only allows happy thoughts!

## The problem
To set up a database on MongoDB and to build an API, using mongoose, to POST to and GET data from the database and then fetch the data in the frontend [Happy thoughts project] (https://github.com/Vera-Sjunnesson/project-happy-thoughts)

## Functionality

The user can:
- Post thoughts
- Add their name and a category to their post (optional)
- View their own and other users thoughts in chronological order
- Like thoughts
- See when thoughts where created, by whom and what category the thought is
- See how many times they've liked something

## Technologies & Tools

-MongoDB
-Node.js
-Mongoose
-Express.js
-CORS
-Express List Endpoints
-Postman

## Endpoints
"/" - Defining the route with a welcome message and links

"/thoughts"
- GET all thoughts in the dataset with the query to sort them by time created in descending order and limit the amount of posts to 20
- POST a thought to the dataset, with the schema properties:
   ```
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
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  category: {
    type: String,
    required: false,
    enum:['Food thought', 'Project thought', 'Home thought']
  }
   
  ```

"/:thoughtId/like"
  - POST a like to a specific thought in the the array of thoughts

## View it live

- [Happy thoughts API](https://project-happy-thoughts-api-3t72lksv4a-lz.a.run.app/)
- [Happy thoughts Frontend](https://happy-thoughts-vera-sjunnesson.netlify.app/)
