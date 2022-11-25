import express from "express";
import { isLoggedIn } from "./middleware.js";
import { createApolloFetch } from "apollo-fetch";
const router = express.Router();
const fetch = createApolloFetch({
    uri: 'https://woongsns.herokuapp.com/graphql'
});
router.post("/post", isLoggedIn, async (req, res) => {
    try {
        fetch({
            query: `mutation DeletePost($_id: ID!) {
                               deletePost(_id: $_id) {
                                 _id
                               }
                             }`,
            variables: {
                _id: req.body.postId,
            }
        })
            .then(() => {
            res.redirect('/');
        });
    }
    catch (err) {
        console.log("Post has not deleted, please try again");
    }
});
router.post("/comment", isLoggedIn, async (req, res) => {
    try {
        fetch({
            query: `mutation DeleteComment($_id: ID!) {
                               deleteComment(_id: $_id) {
                                 _id
                               }
                             }`,
            variables: {
                _id: req.body.commentId,
            }
        })
            .then((result) => {
            console.log("delete", result);
            res.redirect('/');
        });
    }
    catch (err) {
        console.log("Comment has not deleted, please try again");
    }
});
export default router;
