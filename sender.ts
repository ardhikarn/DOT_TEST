require("dotenv").config();
var amqp = require("amqplib/callback_api");

amqp.connect("amqp://" + process.env.RABBITMQ_URL, (err, conn) => {
  if (err) {
    console.log("error", err);
  } else {
    const url = "https://jsonplaceholder.typicode.com";
    const postId = 1; // contoh
    const getPosts = `${url}/posts`;
    const getPostsById = `${url}/posts/${postId}`;
    const getCommentsByPostId = `${url}/posts/${postId}/comments`;
    // const createPost = `${url}/posts`; // api url sama dengan getPosts
    const updatePost = `${url}/posts/${postId}`;
    const ex = "postsById";
    conn.createChannel((err, ch) => {
      // ch.publish("getPosts", "", Buffer.from(getPosts));
      // ch.publish("getPostsById", "", Buffer.from(getPostsById));
      // ch.publish("getCommentsByPostId", "", Buffer.from(getCommentsByPostId));
      // ch.publish("createPost", "", Buffer.from(getPosts));
      ch.publish("updatePost", "", Buffer.from(updatePost));
      // ch.publish('getPosts', "", Buffer.from(getPosts));
    });
    setTimeout(function () {
      conn.close();
      process.exit(0);
    }, 10000);
  }
});
