const express = require("express");
const app = express();
// app.use("/hello", (req, res) => {
//   res.send("Hello World from /hello route");
// });
app.get("/user/:userId/:name",(req,res)=>{
    // console.log(req.query)
    console.log(req.params)
    res.send({"firstName":"Ashis","lastName":'Pal'})
})
app.post("/user",(req,res)=>{
    res.send("User created successfully")
})
app.delete("/user",(req,res)=>{
    res.send("User deleted successfully")
})
// app.use("/", (req, res) => {
//   res.send("Hello World from root route");
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
