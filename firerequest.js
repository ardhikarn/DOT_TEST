const axios = require("axios");

const getPosts = async url => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
};

const getPostsById = async url => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  })
}

const getCommentsByPostId = async url => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  })
}

const createPost = async (url, data) => {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  })
}

const updatePost = async (url, data) => {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  })
}

module.exports = { getPosts, getPostsById, getCommentsByPostId, createPost, updatePost };