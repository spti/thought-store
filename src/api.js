const Dev = require('../dev.js')

class ThoughtsApi extends Dev {
  constructor(crudTree, options) {
    super((options.devEnv) ? options.devEnv : false)

    this.crud = crudTree
  }

  saveTree(body) {
    this.crud.saveTree(body.tree, body.map)
    .then((result) => {
      // translate the thoughts into frontend readable form
      const thoughts = helpers.prettifyMap(result)
      return JSON.stringify(thoughts)
    })
  }

}

module.exports = ThoughtsApi
