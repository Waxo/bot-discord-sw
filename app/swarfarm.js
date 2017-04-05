const swarfarmDB = require('./model/swarfarm');
const logger = require('./utils/logger');

const methods = {
  link: 'https://swarfarm.com/profile',
  errorMessage: 'There was a problem, nothing done',
  register(pseudo, sfAccount) {
    return swarfarmDB.add(sfAccount, pseudo.toLowerCase())
      .then(() => `${pseudo} swarfarm -> ${this.link}/${sfAccount}`)
      .catch(err => {
        logger.log('error', err);
        return this.errorMessage;
      });
  },
  addAlias(sfAccount, alias) {
    return swarfarmDB.addAlias(sfAccount, alias)
      .then(info => {
        if (info.nModified === 0) {
          return 'Not found';
        }
        return 'Alias added';
      })
      .catch(err => {
        logger.log('error', err);
        return this.errorMessage;
      });
  },
  getSwarfarm(alias) {
    return swarfarmDB.findAlias(alias.toLocaleLowerCase())
      .then(docs => {
        if (docs.length > 0) {
          const links = docs.map(doc => doc.link);
          return `${alias} swarfarm -> ${this.link}/${links.join(
            ` or ${this.link}/`)}`;
        }
        return `Il n'existe personne pour le pseudo ${alias}`;
      })
      .catch(err => console.log(err));
  },
  removeAlias(sfAccount, alias) {
    return swarfarmDB.removeAlias(sfAccount, alias)
      .then(() => 'Alias removed')
      .catch(err => {
        logger.log('error', err);
        return this.errorMessage;
      });
  },
  removeSwafarm(sfAccount) {
    return swarfarmDB.remove(sfAccount)
      .then(() => 'Swarfarm removed')
      .catch(err => {
        logger.log('error', err);
        return this.errorMessage;
      });
  }
};

module.exports = methods;
