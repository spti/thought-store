const treeLib = require('./tree-lib.js')
const trees = require('./fake-trees.js')

window.treeLib = treeLib
window.trees = trees

function run() {
  var tree = treeLib.setDepth(trees.tree2variousDepth)
  // console.log();
  tree = treeLib.saveDeepest(tree)
}
