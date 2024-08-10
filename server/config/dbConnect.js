import mongoose from "mongoose";

// Connect to MongoDB
const connectDb=()=>{
mongoose.connect("mongodb+srv://shiniag2000:hSdIW6aVGQOkkfma@ecommerce-graphql-clust.tnchfqv.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Ecommerce-Graphql-cluster", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
}

export default connectDb;