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
  if (deepest == -1) {
    return node
  }

  const deepestIndex = depths.indexOf(deepest)

  // this only saves the terminal node of the deepest path
  var deepestSaved = doSaveDeepestOne(node.children[deepestIndex])
  node.children[deepestIndex] = deepestSaved
  depths[deepestIndex]--

  console.log('doSaveDeepest, didSaveDeepestOne, node', JSON.parse(JSON.stringify(deepestSaved)));
  return doSaveDeepest(node, depths)
  // var i = 0; const len = node.children.length;
  // for (i; i < len; i++) {
  //
  // }

}

// function doSaveDeepestOne(node, depths, branchIndex) {
function doSaveDeepestOne(node) {
  if (node.saved) return node

  // console.log('doSaveDeepestOne', node);

  // if (!node.children || node.children.length == 0) {
  if (!node.children || node.children.length == 0) {
    console.log('doSaveDeepestOne, terminal node, saved', JSON.parse(JSON.stringify(node)));
    node.saved = true
    return node
  }

  // map children's lengths to an array, except those children that are already saved
  var depths = []
  var unsavedIndexes = []
  var i = 0; const len = node.children.length;
  for (i; i < len; i++) {
    if (node.children[i].saved) continue
    depths.push(node.children[i].depth)
    unsavedIndexes.push(i)
  }

  // the node can be saved only and only if all it's descendants
  // are saved (all it's children and all their children and so on)
  if (depths.length == 0) {
    node.depth--
    node.saved = true
    console.log('doSaveDeepestOne, descendants saved, saving.', JSON.parse(JSON.stringify(node)));
    return node
  }

  const deepest = Math.max(...depths)
  var deepestIndex = depths.indexOf(deepest)

  // this only saves the terminal node of the deepest path
  node.children[(unsavedIndexes[deepestIndex])] = doSaveDeepestOne(node.children[(unsavedIndexes[deepestIndex])])

  // The node may contain more than one child with the same depth.
  // If the depth we're looking for is the max depth for this node,
  // then we want to save the terminal node of each of the children
  // with such depth.

  // indexOf returns the index of the first occurence of given value.
  // if theres more than one occurence, to find it we have to remove the part of
  // the array, that we already examined, and then run the indeOf again,
  // on the remainder
  depths = depths.slice(deepestIndex+1)
  unsavedIndexes = unsavedIndexes.slice(deepestIndex+1)

  // deepestIndex = null
  if (depths.length == 0) {
    node.depth--
    return node
  }

  while ((deepestIndex = depths.indexOf(deepest)) > -1) {
    // console.log('doSaveDeepestOne, while loop, deepestIndex:', deepestIndex);
    node.children[(unsavedIndexes[deepestIndex])] = doSaveDeepestOne(node.children[(unsavedIndexes[deepestIndex])])
    depths = depths.slice(deepestIndex+1)
    unsavedIndexes = unsavedIndexes.slice(deepestIndex+1)
  }


  node.depth--
  console.log('deepestOne, depth--', node.depth);
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
