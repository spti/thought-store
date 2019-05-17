const fs = require("fs").promises
const parser = require("thought-store_syntax-parser")

function parseFile(url) {

  return fs.readFile(url, {encoding: 'utf8'})
  .then((fileStr) => {
    console.log("file contents: ", fileStr)

    return parser.parse(fileStr)

    // return converter.format(syntaxTree[0])
    // return syntaxTree[0]
  })
}

function doPrettifyMap(node, map, mapNew, coll) {
  if (node.refs && node.refs.length > 0) {
    node.refs.forEach((ref) => {
      // mapNew.ids[ref.to] = map.saved[ref.to].doc
      doPrettifyMap(map.saved[ref.to], map, mapNew, ref.coll)
    })
  }

  node.doc.type = (coll == 'entities') ? 'entity' : 'resource'
  mapNew.ids[node.doc._id] = node.doc
  return {tree: node.doc, map: mapNew}
}

function prettifyMap(thoughts) {
  return doPrettifyMap(
    thoughts.tree, thoughts.map, {ids: {}},
    (thoughts.tree.refs) ? 'entities' : 'resources'
  )
}

module.exports = {parseFile, prettifyMap}
