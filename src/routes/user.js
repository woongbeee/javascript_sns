import express from "express";
import { isLoggedIn } from "./middleware.js";
import { createApolloFetch } from "apollo-fetch";
import bcrypt from "bcrypt";
const router = express.Router();
const fetch = createApolloFetch({
    uri: 'https://woongsns.herokuapp.com/graphql'
});

router.get('/email', async (req, res) => {
    try {
        fetch({
            query: `query GetUser($id: ID, $email: String, $nickname: String) {
                        getUser(_id: $id, email: $email, nickname: $nickname) {
                                  email
                                 }
                            }`,
            variables: {
                email: req.query.email
            }
        })
            .then((result) => {
            res.send(result);
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/nickname', async (req, res) => {
    try {
        fetch({
            query: `query GetUser($id: ID, $email: String, $nickname: String) {
                        getUser(_id: $id, email: $email, nickname: $nickname) {
                                  nickname
                                 }
                            }`,
            variables: {
                nickname: req.query.nickname
            }
        })
            .then((result) => {
            res.send(result);
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/checkpassword', isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `query GetUser($id:ID,$email:String,$nickname: String) {
                        getUser(_id:$id,email:$email,nickname: $nickname) {
                            password
                          }
                        }`,
            variables: {
                id: _id
            }
        })
            .then(async (result) => {
            const hash = await bcrypt.compare(req.body.params, result.data.getUser.password);
            if (hash) {
                res.send(true);
            }
            else {
                res.send(false);
            }
        });
    }
    catch (err) {
        console.log('failed', err);
    }
});

router.post('/update', isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `mutation UpdateUser($_id:ID!,$nickname: String, $password: String, $profile: String) {
                        updateUser(_id:$_id,nickname: $nickname, password: $password, profile: $profile) {
                                nickname
                                email
                                profile
                              }
                            }`,
            variables: {
                _id: _id,
                nickname: `${req.body.newNickname || req.body.nickname}`,
                profile: `${req.body.url || req.body.profilePic}`,
            }
        })
            .then((result) => {
            res.redirect('/profile');
        });
    }
    catch (err) {
        console.log("Update has been failed", err);
    }
});

router.post('/password', isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    const { newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 12);
    try {
        fetch({
            query: `mutation UpdatePassword($_id:ID!,$password:String!) {
                            updatePassword(_id:$_id,password:$password) {
                                  _id
                                  email
                                  nickname
                                  profile
                                  following{_id}
                                  follower{_id}
                                        }
                                    }`,
            variables: {
                _id: _id,
                password: hash
            }
        })
            .then((result) => {
            res.render('profile', { message: "Password has been changed successfully!" });
        });
    }
    catch (err) {
        res.render('profile', { message: "Server error! Please try again a moment later." });
    }
});

router.post('/deleteaccount', isLoggedIn, async (req, res, next) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `mutation DeleteUser($id: ID!) {
                      deleteUser(_id: $id) {
                        _id
                      }
                    }`,
            variables: {
                id: _id
            }
        })
            .then((result) => {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
            });
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }
            });
            res.redirect('/');
        });
    }
    catch (err) {
        res.render('error');
    }
});

router.post('/follow', isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `mutation FollowUser($id: ID!, $following: ID!) {
                        followUser(_id: $id, following: $following) {
                                     _id
                                     following{_id}
                                     follower{_id}
                                             }
                            }`,
            variables: {
                id: _id,
                following: req.body.id
            }
        })
            .then((result) => {
            res.redirect(`/getfeed?id=${result.data.followUser._id}`);
        });
    }
    catch (err) {
        res.render('error');
    }
});

router.post('/unfollow', isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `mutation UnfollowUser($id: ID!, $follower: ID!) {
                         unfollowUser(_id: $id, follower: $follower) {
                                _id
                                following{_id}
                                follower{_id}
                              }
                            }`,
            variables: {
                id: _id,
                follower: req.body.id
            }
        })
            .then((result) => {
            res.redirect(`/getfeed?id=${result.data.unfollowUser._id}`);
        });
    }
    catch (err) {
        res.render('error');
    }
});

router.get('/getfollowing', isLoggedIn, async (req, res) => {
    try {
        fetch({
            query: `query GetFollowing($id: ID) {
                        getFollowing(_id: $id) {
                            _id
                            nickname
                            profile
                          }
                        }`,
            variables: {
                id: req.query.id
            }
        })
            .then((result) => {
            res.render('followers', { title: 'sns', followings: result.data.getFollowing });
        });
    }
    catch (err) {
        res.render('error');
    }
});

router.get('/getfollower', isLoggedIn, async (req, res) => {
    try {
        fetch({
            query: `query GetFollower($id: ID) {
                      getFollower(_id: $id) {
                        _id
                        nickname
                        profile
                      }
                    }`,
            variables: {
                id: req.query.id
            }
        })
            .then((result) => {
            res.render('followers', { title: 'sns', followings: result.data.getFollower });
        });
    }
    catch (err) {
        res.render('error');
    }
});
export default router;
