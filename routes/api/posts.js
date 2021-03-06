const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post');
const Profile = require("../../models/Profile");
const {User} = require("../../models/User");

//@route POST api/posts
//@desc  Create a post
//@access Private

router.post('/', [auth, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error')
    }



});



//@route Get api/posts
//@desc  Get all posts
//@access Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }

});



//@route Get api/posts/:id
//@desc  Get Post by ID
//@access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.log(error.message);

        if (error.kind === 'ObjetId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }

});


//@route Delete api/posts/:id
//@desc  Get a Post 
//@access Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }

        await post.remove();
        res.json({ msg: "Post removed" });
    } catch (error) {
        console.log(error.message);

        if (error.kind === 'ObjetId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }

});



//@route Put api/posts/like/:id
//@desc  Like a post 
//@access Private

router.put("/like/:id", auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" });
        }
        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjetId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})


//@route Put api/posts/unlike/:id
//@desc  UnLike a post 
//@access Private

router.put("/unlike/:id", auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not yet been liked" });
        }
        let removeIndex = -1;
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].user.toString() === req.user.id) {
                removeIndex = i;
                break;
            }
        }
        if (removeIndex != -1) {
            post.likes.splice(removeIndex, 1);
        }
        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjetId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})


//@route POST api/posts/comment/:id
//@desc  Comment on a post
//@access Private

router.post('/comment/:id', [auth, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        console.log(newComment);
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }



});


//@route Delete api/posts/comment/:id/:comment_id
//@desc  Delete Comment on a post
//@access Private


router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        let removeIndex = -1;
        
        for (let i = 0; i < post.comments.length; i++) {
            if (post.comments[i].id.toString() === req.params.comment_id) {
                if (post.comments[i].user.toString() !== req.user.id) {
                    return res.status(401).json({ msg: "User is not authorized" })
                }
                removeIndex = i;
                break;
            }
        }

        if (removeIndex === -1) {
            return res.status(404).json({ msg: 'Comment does not exist' })
        }

        if (removeIndex != -1) {
            post.comments.splice(removeIndex, 1);
        }

        await post.save();
        res.json(post.comments);


    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjetId') {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }
        res.status(500).send('Server Error');
    }
})



router.get("/", (req, res) => res.send("Posts route"));



module.exports = router