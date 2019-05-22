var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

const routes = [
  'root',
  'some-content',
  'another-content',
  'there',
  'place-to-go',
  'useful-place',
];

var UserDataSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  routes: [String],
}, { timestamps: true });

UserDataSchema.plugin(uniqueValidator, { message: 'is already taken' });

UserDataSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

UserDataSchema.methods.slugify = function () {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

UserDataSchema.methods.addRoute = function (route) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }

  return this.save();
};

UserDataSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    routes: this.routes,
  };
};

mongoose.model('UserData', UserDataSchema);
