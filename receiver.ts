require("dotenv").config();
const model = require("./config/model/index");
var amqp = require("amqplib/callback_api");
var {
  getPosts,
  getPostsById,
  getCommentsByPostId,
  createPost,
  updatePost,
} = require("./firerequest");
var connection = require("./config/database/mysql");

amqp.connect("amqp://" + process.env.RABBITMQ_URL, (err, conn) => {
  conn.createChannel((err, ch) => {
    ch.assertExchange("getPosts", "fanout", { durable: false });
    ch.assertExchange("getPostsById", "fanout", { durable: false });
    ch.assertExchange("getCommentsByPostId", "fanout", { durable: false });
    ch.assertExchange("createPost", "fanout", { durable: false });
    ch.assertExchange("updatePost", "fanout", { durable: false });
    ch.assertExchange("deletePost", "fanout", { durable: false });

    ch.assertQueue("", { exclusive: true }, (err, q) => {
      console.log("Menunggu Pesan Antrian %s dari Pengirim", q.queue);
      ch.bindQueue(q.queue, "getPosts", "");
      ch.bindQueue(q.queue, "getPostsById", "");
      ch.bindQueue(q.queue, "getCommentsByPostId", "");
      ch.bindQueue(q.queue, "createPost", "");
      ch.bindQueue(q.queue, "updatePost", "");
      ch.bindQueue(q.queue, "deletePost", "");

      ch.consume(q.queue, async (msg) => {
        console.log(msg);
        const url = msg.content.toString();
        if (msg.fields.exchange === "getPosts") {
          const posts = await getPosts(url);
          for (let i = 0; i < posts.length; i++) {
            const data = {
              userId: posts[i].userId,
              title: posts[i].title,
              body: posts[i].body,
            };
            await model.posts.create(data);
          }
        } else if (msg.fields.exchange === "getPostsById") {
          const postsById = await getPostsById(url);
          console.log(postsById);
        } else if (msg.fields.exchange === "getCommentsByPostId") {
          const comments = await getCommentsByPostId(url);
          for (let i = 0; i < comments.length; i++) {
            const data = {
              postId: comments[i].postId,
              name: comments[i].name,
              email: comments[i].email,
              body: comments[i].body,
            };
            await model.comments.create(data);
          }
        } else if (msg.fields.exchange === "createPost") {
          const data = {
            userId: "1",
            title: "Menambahkan POST Ke database",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum nostrum odio nobis consequuntur dolorum repellendus nihil quam a illum reiciendis",
          };
          await createPost(url, data);
          await model.posts.create(data);
        } else if (msg.fields.exchange === "updatePost") {
          const data = {
            userId: 1,
            title: "Update Data",
            body: "Berhasil mengupdate Data",
          };
          const update = await updatePost(url, data);
          console.log(update);

          await model.posts.update(data, {
            where: { id: update.userId },
          });
        } else if (msg.fields.exchange === "deletePost") {
          try {
            await model.posts.destroy({ where: { id: url } });
          } catch (error) {
            console.log(error);
          }

          // .catch((error) => {
          //   if (error.message === "Cannot read property 'id' of undefined") {
          //     console.log(`Id ${url} tidak ditemukan`);
          //   }
          // });
        }
      });
    });
  });
});
