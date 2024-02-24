import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try{
        const postMessages = await PostMessage.find();
      
        res.status(200).json(postMessages);
    }catch(error){
        res.status(404).json({message: error.message});

    }
}

export const createPost = async (req,res) => {
   const post = req.body;
   console.log(post)
   const newPost = new PostMessage(post);

   try{
    await newPost.save();


    res.status(201).json(newPost);
   }catch (error){
    res.status(409).json({message: error.message});
   }
}

export const updatePost = async (req,res)=>{
    const {id} = req.params
    const post = req.body
    console.log(id)
 //    console.log(post)
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with that id`)

   const updatePost = await PostMessage.findByIdAndUpdate(id,post,{new:true})

   res.json(updatePost)

}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that id");
    }

    try {
        const deletedPost = await PostMessage.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).send('Post not found');
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
    
    res.json(updatedPost);
}
