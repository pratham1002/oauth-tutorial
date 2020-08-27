const express = require("express");
const router = new express.Router();
const { getTokensFromCode, getUserData, googleLoginUrl } = require("./googleAuthHelpers");
const User = require("../models/user");


router.get("/auth/google", async (req, res) => {
    await res.redirect(googleLoginUrl);
});

router.get("/auth/google/redirect", async (req, res) => {
    const code = await (req.query.code)
    const { access_token, refresh_token } = await getTokensFromCode(code)
    const data = await getUserData(access_token)

    let user = await User.findOne({ email: data.email })

    if (!user) {
        user = new User({
            name: data.name,
            email: data.email,
            geegleId: data.id
        })
        await user.save()
    }

    // save the access and refresh token
    user.access_token = access_token
    user.refresh_token = refresh_token
    await user.save()

    console.log(user)

    const token = await user.generateAuthToken()
    res.cookie('jwt', token)
    res.send(user)
})

module.exports = router