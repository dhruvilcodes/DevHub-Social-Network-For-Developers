const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require("../../models/Profile");
const { User } = require("../../models/User");
const { check, validationResult } = require("express-validator/check")
const mongoose = require('mongoose')
const request = require('request')
const config = require('config')
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Group = require("../../models/Group")

//@route POST api/group
//@desc  Create a group 
//@access Private


router.post('/', [auth, [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('date', 'Date is required')
        .not()
        .isEmpty(),
    check('size', 'Size is required')
        .not()
        .isEmpty(),
    check('website', 'website is required')
        .not()
        .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const {
            name,
            website,
            date,
            bio,
            size,

        } = req.body;


        const groupDetails = {
            name,
            website,
            date,
            bio,
            size
        };
        groupDetails.participants = []
        let user = mongoose.Types.ObjectId(req.user.id);
        groupDetails.participants = [];
        groupDetails.participants.push(req.user.id)

        groupDetails.admin = mongoose.Types.ObjectId(req.user.id)
        groupDetails.currsize = 1;
        if (groupDetails.currsize == groupDetails.size) {
            groupDetails.done = true

        }
        let group = new Group(groupDetails);

        await group.save();
        res.status(200).json(group);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


router.put('/:groupId', auth, async (req, res) => {

    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({
                error: "Group not found"
            })
        }
        if (group.admin == req.user.id) {
            return res.status(401).json({
                error: "You are not allowed to do this operation"
            })
        }
      

        let isPresent = -1;
        for (let i = 0; i < group.participants.length; i++) {
            if (group.participants[i] == req.user.id) {
                isPresent = i;
                break;
            }
        }
        if (isPresent == -1) {
            if (group.done) {
                return res.status(401).json({
                    error: "Group Already Full"
                })
    
            }
            group.participants.push(req.user.id);
            group.currsize++;
            if (group.currsize == group.size) {
                group.done = true;
            }
        }
        else {
            group.participants.splice(isPresent, 1);
            group.currsize--;
            group.done = false;
        }
        await group.save();
        res.status(200).json(group)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})


router.get("/", async (req, res) => {
    try {
        let groups = await Group.find();
        res.status(200).json(groups);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error:"Server Error"});
    }
})


router.delete("/:groupId", auth, async (req, res) => {
    try {
        let group = await Group.findById(req.params.groupId);

        if (!group) {

            return res.status(404).json({
                error: "Group not found"
            })
        }
        if (group.admin != req.user.id) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }
        res.status(200).json(group);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})






//@route GET api/profile/user/:user_id
//@desc Get profile by user ID
//@access Public

router.get("/:groupId", async (req, res) => {
    try {
        let group = await Group.findById(req.params.groupId);

        if (!group) return res.status(400).json({ msg: "Group not found" })

        let result = [];
        for (let i = 0; i < group.participants.length; i++) 
        {
            let profile = await Profile.findOne({ user: group.participants[i] }).populate('user', ['name', 'avatar']);

            if (profile) {
                result.push(profile);
            }
            
        }

        res.json({ group, result });
    }catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: "Profile not found" })
    }
    res.status(500).send('Server Error')
}

});


module.exports = router;