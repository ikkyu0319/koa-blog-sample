var parse = require('co-body');
var render = require('../render');
var Post = require('../../models/post');
var Tag = require('../../models/tag');

// GET /
exports.index = function *() {
  var posts = yield Post.findAll({ withRelated: ['user', 'comments'] });
  this.body = yield render('post/index', { posts: posts.toJSON() });
}

// GET /new
exports.new = function *() {
  var tags = yield Tag.findAll();
  this.body = yield render('post/new', { post: new Post().toJSON(), tags: tags.toJSON() });
}

// POST /
exports.create = function *() {
  var post = new Post(this.req.body.post);
  var tags;

  post.set('user_id', this.user.id);

  if (yield post.save()) {
    this.redirect('/admin/posts');
  } else {
    tags = yield Tag.findAll();
    this.body = yield render('post/new', { post: post.toJSON(), tags: tags.toJSON() });
  }
}

// GET /:post/edit
exports.edit = function *(postId) {
  var post = yield new Post({ id: postId }).fetch({ require: true, withRelated: 'tags' });
  var tags = yield Tag.findAll();

  this.body = yield render('post/edit', { post: post.toJSON(), tags: tags.toJSON() });
};

// PUT /:post
exports.update = function *(postId) {
  var post = yield new Post({ id: postId }).fetch({ require: true, withRelated: 'tags' });
  var tags = yield Tag.findAll();

  post.set(this.req.body.post);

  if (yield post.save()) {
    this.redirect('/admin/posts');
  } else {
    this.body = yield render('post/edit', { post: post.toJSON(), tags: tags.toJSON() });
  }
};

// DELETE /:post
exports.destroy = function *(postId) {
  var deleted = yield new Post({ id: postId }).destroy();
  this.body = postId + ' deleted';
};

