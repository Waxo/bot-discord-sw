const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGO);
const Schema = mongoose.Schema;

const swarfarmSchema = new Schema({
  link: {type: String, unique: true},
  alias: [String]
});

const Swarfarm = mongoose.model('Swarfarm', swarfarmSchema);

const methods = {
  add(link, alias) {
    return new Swarfarm({link, alias}).save();
  },
  addAlias(link, alias) {
    return Swarfarm.update({link}, {$addToSet: {alias}});
  },
  findAlias(alias) {
    return Swarfarm.find({alias}).exec();
  },
  removeAlias(link, alias) {
    return Swarfarm.update({link}, {$pull: {alias}});
  },
  remove(link) {
    return Swarfarm.remove({link}).exec();
  }
};

module.exports = methods;
