const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwtSign = require('../helpers/jwt-sign');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const EmailConflictError = require('../errors/email-conflict-err');
const CastError = require('../errors/cast-err');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!validator.isEmail(email)) {
    throw new ValidationError('Некорректный email пользователя');
  }

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          res.send({
            data: {
              _id: user._id,
              email: user.email,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
            },
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ValidationError('Некорректно введены данные'));
            return;
          }
          if (err.code === 11000) {
            next(new EmailConflictError('Пользователь с таким email уже существует'));
            return;
          }

          next(err);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwtSign(user._id);
      return res.send({ token });// возвращаем токен
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неверные данные'));
        return;
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неверные данные'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректно введены данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new CastError('Неверные данные'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректно введены данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new CastError('Неверные данные'));
        return;
      }
      next(err);
    });
};
