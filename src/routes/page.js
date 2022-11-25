import express from "express";
import { isLoggedIn, isNotLoggedIn } from "./middleware.js";
import { createApolloFetch } from "apollo-fetch";
const router = express.Router();
const fetch = createApolloFetch({
    uri: 'https://woongsns.herokuapp.com/graphql'
});
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', (req, res, next) => {
    try {
        fetch({
            query: `query GetPosts {
                      getPosts {
                        _id
                        writer{
                            _id
                            nickname
                            profile
                            following{_id}
                            follower{_id}
                               }
                        comments {
                          _id
                          writer {
                            _id
                            nickname
                             }
                              comment
                            }
                           text
                           pictures
                           likes {
                             _id
                             nickname
                             profile
                           }
                           createdAt
                         }
                        }`,
        })
            .then((result) => {
            result.data.getPosts.reverse();
            res.render('main', { title: 'sns', posts: result.data.getPosts });
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/getpost', async (req, res) => {
    try {
        fetch({
            query: `query GetPosts($id: ID) {
                          getPosts(_id: $id) {
                            pictures
                            text
                            likes {
                              _id
                            }
                            comments {
                              _id
                              comment
                              writer {
                                nickname
                              }
                            }
                          }
                        }`,
            variables: {
                id: req.query.id
            }
        })
            .then((result) => {
            res.send(result.data.getPosts[0]);
        });
    }
    catch (err) {
        console.log("post router", err);
    }
});

router.get('/getfeed', async (req, res) => {
    try {
        fetch({
            query: `query GetPosts($writer: String) {
                          getPosts(writer: $writer) {
                            _id
                            pictures
                            writer{
                                _id
                                profile
                                nickname
                                post{_id}
                                follower{_id}
                                following{_id}
                              }
                             likes{_id}
                           }
                        }`,
            variables: {
                writer: req.query.id
            }
        })
            .then((result) => {
            res.render('feed', { title: "sns", feed: result.data.getPosts });
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/join', isNotLoggedIn, async (req, res) => {
    res.render('join');
});

router.get('/profile', isLoggedIn, async (req, res) => {
    res.render('profile');
});

router.get('/password', isLoggedIn, async (req, res) => {
    let { keyword } = req.query;
    if (keyword === 'change') {
        res.render('password', { keyword: 'change' });
    }
    else {
        res.render('password', { keyword: 'delete' });
    }
});
export default router;
