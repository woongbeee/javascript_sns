import express from "express";
import { isLoggedIn } from "./middleware.js";
import multer from "multer";
import path from "path";
import { createApolloFetch } from "apollo-fetch";
const router = express.Router();
const fetch = createApolloFetch({
    uri: 'https://woongsns.herokuapp.com/graphql'
});
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, './src/uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 11048576 },
});

router.post('/profile', upload.single('img'), async (req, res) => {
    if (req.file) {
        res.json(`/img/${req.file.filename}`);
    }
});

router.post('/img', upload.array('img', 5), async (req, res) => {
    let urlArr = Array.from(req.files);
    let url = new Array();
    for (let i = 0; i < urlArr.length; i++) {
        url[i] = `/img/${urlArr[i].filename}`;
    }
    res.json(url);
});
const upload2 = multer();

router.post('/', isLoggedIn, upload2.none(), async (req, res) => {
    const { _id, nickname } = req.user;
    if (req.body.text === '' && req.body.url == null) {
        res.redirect(`/?error=nocontent`);
    }
    else {
        try {
            fetch({
                query: `mutation CreatePost($writer:userInput!, $nickname: String!, $text: String!, $pictures:[String]!) {
                        createPost(writer: $writer, nickname: $nickname, text: $text, pictures:$pictures) {
                          _id
                          writer{_id}
                          nickname
                          comments {
                            comment
                          }
                          text
                          pictures
                          likes {
                            nickname
                          }
                         createdAt
                       }
                      }`,
                variables: {
                    writer: { _id: _id },
                    nickname: nickname,
                    text: `${req.body.text || "none"}`,
                    pictures: req.body.url,
                }
            })
                .then((result) => {
                res.redirect('/');
            });
        }
        catch (err) {
            res.render('error', { message: "Sorry! Error occured. Please try again." });
        }
    }
});

router.post("/comment", isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `mutation Mutation($writer:userInput!, $post:postInput!,$comment:String!) {
                        createComment(writer:$writer, post:$post,comment:$comment) {
                                 _id
                                 writer{_id}
                                 post{_id}
                                 comment
                                 createdAt
                               }
                           }`,
            variables: {
                writer: { _id: _id },
                post: { _id: req.body.postId },
                comment: `${req.body.comment || "none"}`,
            }
        })
            .then((result) => {
            res.redirect('/');
        });
    }
    catch (err) {
        console.log("comment failed to be saved", err);
    }
});

router.post('/modify', isLoggedIn, async (req, res) => {
    console.log("post router", req.body);
    try {
        fetch({
            query: `mutation UpdatePost($id: ID!, $text: String, $pictures: [String]) {
                  updatePost(_id: $id, text: $text, pictures: $pictures) {
    _id
    writer {
      _id
      nickname
      profile
    }
    comments {
      writer {
        nickname
      }
      comment
      createdAt
    }
    text
    pictures
    likes {
      nickname
    }
    createdAt
  }
}`,
            variables: {
                id: req.body.id,
                text: `${req.body.text || "none"}`,
                pictures: req.body.url,
            }
        })
            .then((result) => {
            console.log("modified post", result);
            res.redirect('/');
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/like', isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `mutation Like($id: ID!, $likes: ID!) {
                          like(_id: $id, likes: $likes) {
                            likes {
                              _id
                              nickname
                              profile
                            }
                          }
                        }`,
            variables: {
                id: req.body.postId,
                likes: _id
            }
        })
            .then((result) => {
            res.send(result.data.like);
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/unlike', isLoggedIn, async (req, res) => {
    const { _id } = req.user;
    try {
        fetch({
            query: `mutation Unlike($id: ID!, $likes: ID!) {
                          unlike(_id: $id, likes: $likes) {
                            likes {
                              _id
                              nickname
                              profile
                            }
                          }
                        }`,
            variables: {
                id: req.body.postId,
                likes: _id
            }
        }).
            then((result) => {
            res.send(result.data.unlike);
        });
    }
    catch (err) {
        console.log(err);
    }
});
export default router;
