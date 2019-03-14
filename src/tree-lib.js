function uuid() {
  return Date.now().toString()
}

function doSetDepth(node, level) {
  // console.log("doNode, node: ", node);

  if (node.ref) {
    // console.log('doNode, the node is a ref, pulling the ref')
    // if (idMap[node.id].traversed) {
    //   console.log('the node ref is already trraversed, skipping');
    //   return idMap[node.id]
    // }
    // return doSetDepth(idMap[node.id], level, entityIndex)
  }

  if (node.traversed) {
    // console.log("doNode, node is traversed, skipping");
    return node
  }

  if (!node.children || node.children.length == 0) {
    // console.log("doNode, the node is terminal");
    node.level = level
    node.depth = 0

    return node
  }

  node.level = level

  var maxDepth = 0
  var i = 0; const len = node.children.length;
  for (i; i < len; i++) {

    const child = node.children[i]
    if (!child.traversed) {
      doSetDepth(child, level+1)
    }

    if (child.depth > maxDepth) {
      maxDepth = child.depth
    }
  }

  // entityIndex = 0

  node.depth = maxDepth +1
  node.traversed = true
  // console.log('doNode, done the node: ', node);

  return node
}

function setDepth(tree) {
  // const idMap = mapNodes(tree, {})
  return doSetDepth(tree, -1)
}

function doSaveDeepest(node, depths) {

  console.log('doSaveDeepest', depths);
  const deepest = Math.max(...depths)
  if (deepest == 0) {
    return node
  }

  const deepestIndex = depths.indexOf(deepest)

  // this only saves the terminal node of the deepest path
  doSaveDeepestOne(node.children[deepestIndex])
  depths[deepestIndex]--

  return doSaveDeepest(node, depths)
  // var i = 0; const len = node.children.length;
  // for (i; i < len; i++) {
  //
  // }

}

function doSaveDeepestOne(node) {
  if (node.saved) return node

  console.log('doSaveDeepestOne', node);

  if (!node.children || node.children.length == 0) {
    node.saved = true
    return node
  }

  const depths = node.children.map((child) => {
    return child.depth
  })

  const deepestIndex = depths.indexOf(Math.max(...depths))

  // this only saves the terminal node of the deepest path
  doSaveDeepestOne(node.children[deepestIndex])
  node.depth--

  return node
}

function saveDeepest(node) {
  const depths = node.children.map((child) => {
    return child.depth
  })

  return doSaveDeepest(node, depths)
}

module.exports = {
  setDepth, saveDeepest
}
