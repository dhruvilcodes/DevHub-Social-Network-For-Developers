const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require("../../models/Profile");
const {User} = require("../../models/User");
const { check, validationResult } = require("express-validator/check")
const mongoose = require('mongoose')
const request = require('request')
const config = require('config')
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


//@route GET api/profile/me
//@desc  Get current user profile
//@access Private
router.get("/me", auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Sever Error')
    }

});


//@route POST api/profile
//@desc  Create or update user profile
//@access Private

router.post('/', auth, async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image"
            });
        }
        //destructure the fields
        const { organization,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            leetcode,
            codeforces,
            codechef,
            linkedin } = fields;
         
        if (!status) {
            return res.status(400).json({ errors: "Status is required" });
        }

        if (!skills) {
            return res.status(400).json({ errors: "Skills is required" });
        }


        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (organization) profileFields.organization = organization;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }


        //Build Social object
        profileFields.social = {}

        if (leetcode) profileFields.social.leetcode = leetcode;
        if (codeforces) profileFields.social.codeforces = codeforces;
        if (codechef) profileFields.social.codechef = codechef;
        if (linkedin) profileFields.social.linkedin = linkedin;


    
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                });
            }
            profileFields.photo={}
            profileFields.photo.data = fs.readFileSync(file.photo.filepath);
            profileFields.photo.contentType = file.photo.mimetype;
        }
        


        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                //Update
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, {
                    $set: profileFields
                }, { new: true });

                await profile.save();
                return res.json(profile);
            };

            

            profile = new Profile(profileFields)
            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }

    

    })
});

// router.post('/', [auth, [
//     check('status', 'Status is required')
//         .not()
//         .isEmpty(),
//     check('skills', 'Skills is required')
//         .not()
//         .isEmpty()

// ]], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const {
//         organization,
//         website,
//         location,
//         bio,
//         status,
//         githubusername,
//         skills,
//         leetcode,
//         codeforces,
//         codechef,
//         linkedin
//     } = req.body;

//     //Build profile object
//     const profileFields = {};
//     profileFields.user = req.user.id;
//     if (organization) profileFields.organization = organization;
//     if (website) profileFields.website = website;
//     if (location) profileFields.location = location;
//     if (bio) profileFields.bio = bio;
//     if (status) profileFields.status = status;
//     if (githubusername) profileFields.githubusername = githubusername;
//     if (skills) {
//         profileFields.skills = skills.split(',').map(skill => skill.trim())
//     }


//     //Build Social object
//     profileFields.social = {}

//     if (leetcode) profileFields.social.leetcode = leetcode;
//     if (codeforces) profileFields.social.codeforces = codeforces;
//     if (codechef) profileFields.social.codechef = codechef;
//     if (linkedin) profileFields.social.linkedin = linkedin;

//     try {
//         let profile = await Profile.findOne({ user: req.user.id });
//         if (profile) {
//             //Update
//             profile = await Profile.findOneAndUpdate({ user: req.user.id }, {
//                 $set: profileFields
//             }, { new: true });

//             await profile.save();
//             return res.json(profile);
//         };

//         profile = new Profile(profileFields)
//         await profile.save();
//         return res.json(profile);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });


router.get("/photo/:profileId",async(req,res)=>{
    let id=req.params['profileId'];

    try {
        let profile = await Profile.findById(id);
        // console.log(profile)
        if (profile) {
            // console.log(profile.photo.data)
           if(profile.photo.data)
           {
            res.set("Content-Type", profile.photo.contentType);
            return res.send(profile.photo.data);
           }
        };
        return res.send();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }

});

//@route GET api/profile
//@desc  Get all profiles
//@access Public


router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});


//@route GET api/profile/user/:user_id
//@desc Get profile by user ID
//@access Public

router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if (!profile) return res.status(400).json({ msg: "Profile not found" })
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: "Profile not found" })
        }
        res.status(500).send('Server Error')
    }

});


//@route Delete api/profile
//@desc Delete profile,user and posts
//@access Private

router.delete("/", auth, async (req, res) => {
    try {
        //@todo

        await Post.deleteMany({ user: req.user.id })

        //Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({
            msg: "User Deleted"
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: "Profile not found" })
        }
        res.status(500).send('Server Error')
    }

});


//@route PUT api/profile/experience
//@desc Add profile experience
//@access Private

router.put('/experience', [auth, [
    check('title', 'Title is required')
        .not()
        .isEmpty(),
    check('organization', 'organization is required')
        .not()
        .isEmpty(),
    check('from', 'From Date is required')
        .not()
        .isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        title,
        organization,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        organization,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }


})

//@route DELETE api/profile/experience/:exp_id
//@desc Delete profile experience
//@access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({
            user: req.user.id
        })

        let removeIndex = -1;
        let to_iterate = profile.experience;

        for (let i = 0; i < to_iterate.length; i++) {
            if (to_iterate[i]._id == (req.params.exp_id)) {
                console.log(to_iterate[i]);
                removeIndex = i;
                break;
            }

        }
        if (removeIndex != -1)
            profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile)

    } catch (err) {

        console.error(err.message);
        res.status(500).send('Server Error');
    }
})




//@route PUT api/profile/education
//@desc Add profile education
//@access Private

router.put('/education', [auth, [
    check('school', 'School is required')
        .not()
        .isEmpty(),
    check('degree', 'Degree is required')
        .not()
        .isEmpty(),
    check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
    check('from', 'From date is required')
        .not()
        .isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        })
        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }


})

//@route DELETE api/profile/experience/:exp_id
//@desc Delete profile experience
//@access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({
            user: req.user.id
        })

        let removeIndex = -1;
        let to_iterate = profile.education;

        for (let i = 0; i < to_iterate.length; i++) {
            if (to_iterate[i]._id == (req.params.edu_id)) {
                console.log(i);
                removeIndex = i;
                break;
            }

        }
        if (removeIndex != -1)
            profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile)

    } catch (err) {

        console.error(err.message);
        res.status(500).send('Server Error');
    }
})



//@route Get api/profile/github/:username
//@desc  Get user repos from Github
//@access Public



router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }


        request(options, (error, respone, body) => {
            if (error) console.error(error);
            if (respone.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }
            body = JSON.parse(body)
            res.json(body)

        })



    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;