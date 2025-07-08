import mongoose from "mongoose";

mongoose
  .connect("mongodb+srv://aayansh:aayansh234@cluster0.ovjz5ux.mongodb.net/tododb")
  .then(async () => {
    console.log("Connected to DB");

    const result = await mongoose.connection.db
      .collection("users")
      .dropIndex("username_1");
    console.log("Dropped index:", result);

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error:", err);
  });
