const Dev = require('../dev.js')
const helpers = require('../util/helpers.js')

class ThoughtsApi extends Dev {
  constructor(crudTree, options) {
    super((options.devEnv) ? options.devEnv : false)

    this.options = options || {log: function() {}}

    this.crud = crudTree
  }

  saveTree(body) {
    return this.crud.saveTree(body.tree, body.map)
    .then((result) => {
      this.log('api.saveTree, crud.saveTree resolved', result)
      // this.options.log('api.saveTree, crud.saveTree resolved', result)

      // translate the thoughts into frontend readable form
      const thoughts = helpers.prettifyMap(result)
      return JSON.stringify(thoughts)
    })
  }

}

module.exports = ThoughtsApi
