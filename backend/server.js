import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT,() => {
    console.log(`Server running on the port ${PORT}`);
  
})