class ThoughtsApi extends Dev {
  constructor(crudTree) {
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
