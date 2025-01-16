import express from "express";

const app = express();

app.get("/*",(req,res)=>{
  const host = req.hostname;
  const id = host.split(".")[0];
  res.send(`Hello ${id} hostname: ${host}`);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
