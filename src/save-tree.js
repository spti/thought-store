
function traverseAsync(node, save) {

  function doTraverseChildrenAsync(childrenToSave, childrenSaved) {
    return doTraverseAsync(childrenToSave.shift())
    .then((savedChild) => {
      childrenSaved.unshift(savedChild)

      if (childrenToSave.length == 0) {
        return childrenSaved
      }

      return doTraverseChildrenAsync(childrenToSave, childrenSaved)
    })
  }

  function doTraverseAsync(node) {
    if (!node.children || node.children.length == 0) {
      return save(node)
    }

    return doTraverseChildrenAsync([].concat(node.children), [])
    .then((savedChildren) => {
      node.children = savedChildren
      return save(node)
    })
  }

  return doTraverseAsync(node)
}

/*
function traverseAsync(node, save) {

  function doTraverseChildrenAsync(childrenToSave, childrenSaved) {
    return doTraverseAsync(childrenToSave.shift())
    .then((savedChild) => {
      childrenSaved.unshift(savedChild)

      if (childrenToSave.length == 0) {
        return childrenSaved
      }

      return doTraverseChildrenAsync(childrenToSave, childrenSaved)
    })
  }

  function doTraverseAsync(node) {
    if (!node.children || node.children.length == 0) {
      return save(node)
    }

    return doTraverseChildrenAsync([].concat(node.children), [])
    .then((savedChildren) => {
      node.children = savedChildren
      return save(node)
    })
  }

  return doTraverseAsync(node)
}
*/

function saveDeepestAsync(tree, maps, save) {
  function doSave(node, depths) {
    return new Promise((resolve, reject) => {
      const deepest = Math.max(...depths)
      if (deepest == -1) {
        return resolve(node)
      }

      const deepestIndex = depths.indexOf(deepest)

      console.log('doSave, depths', depths)
      // this only saves the terminal node of the deepest path
      return doSaveOne(node.children[deepestIndex], maps)
      .then((deepestSaved) => {
        console.log('doSave, didSaveOne.then');
        node.children[deepestIndex] = deepestSaved
        depths[deepestIndex]--

        // console.log('doSaveDeepest, didSaveDeepestOne, node', JSON.parse(JSON.stringify(deepestSaved)));
        return doSave(node, depths, maps).then((res) => {return resolve(res)})
      })
      // .then((didSave) => {
      //   return resolve(didSave)
      // })
    })

  }

  function doSaveOne(node) {
    return new Promise((resolve, reject) => {
      if (node.visited) return resolve(node)

      // console.log('doSaveDeepestOne', node);

      if (node.type == 'label') {
        if (node.terminal) {
          node.visited = true


          // the referenced node is by definition an ancestor of the current node,
          // so we save it for later, because this method traverses in the direction
          // from descendants to ancestors, so to set the id of the referenced node
          // as referee in this node, we need to first save that node.
          maps.terminals.push(node)
          return resolve(node)
        }

        return doSaveOne(maps.ids[node.to]).then((res) => {return resolve(res)})
      }

      // if (!node.children || node.children.length == 0) {
      if (!node.children || node.children.length == 0) {
        // console.log('doSaveDeepestOne, terminal node, saved', JSON.parse(JSON.stringify(node)));

        console.log('doSaveOne, node has no children, saving')
        node.visited = true
        return save(node).then((savedDoc) => {return resolve(savedDoc)})
      }

      // map children's lengths to an array, except those children that are already saved
      var depths = []
      var unsavedIndexes = []
      var i = 0; const len = node.children.length;
      for (i; i < len; i++) {
        if (node.children[i].visited) continue
        depths.push(node.children[i].depth)
        unsavedIndexes.push(i)
      }

      // the node can be saved only and only if all it's descendants
      // are saved (all it's children and all their children and so on)
      if (depths.length == 0) {
        node.depth--

        node.visited = true
        console.log('doSaveOne, descendants saved, saving')
        return save(node).then((savedDoc) => {return resolve(savedDoc)})
        // console.log('doSaveDeepestOne, descendants saved, saving.', JSON.parse(JSON.stringify(node)));
        // return node
      }

      const deepest = Math.max(...depths)
      var deepestIndex = depths.indexOf(deepest)

      // this only saves the terminal node of the deepest path
      return doSaveOne(node.children[(unsavedIndexes[deepestIndex])])
      .then((nodeSaved) => {
        node.children[(unsavedIndexes[deepestIndex])] = nodeSaved

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
          node.visited = true
          console.log('doSaveOne, saved the descendants, so saving the node')
          return save(node).then((res) => {return resolve(res)})
        }

        const nodesToSave = []
        while ((deepestIndex = depths.indexOf(deepest)) > -1) {
          const nodeToSave = node.children[(unsavedIndexes[deepestIndex])]
          nodeToSave.index = unsavedIndexes[deepestIndex]
          nodesToSave.push(nodeToSave)

          // console.log('doSaveDeepestOne, while loop, deepestIndex:', deepestIndex);
          depths = depths.slice(deepestIndex+1)
          unsavedIndexes = unsavedIndexes.slice(deepestIndex+1)

          // console.log('doSaveDeepestOne, while loop, deepestIndex:', deepestIndex);
          // node.children[(unsavedIndexes[deepestIndex])] = doSaveDeepestOne(node.children[(unsavedIndexes[deepestIndex])], maps)
          // depths = depths.slice(deepestIndex+1)
          // unsavedIndexes = unsavedIndexes.slice(deepestIndex+1)
        }

        return saveArray(nodesToSave, [])
        .then((nodesSaved) => {
          console.log('savedArray, resolving');
          nodesSaved.forEach((nodeSaved) => {
            node.children[nodeSaved.index] = nodeSaved
          })

          node.depth--
          // return save(node).then((res) => {return resolve(res)})
          return resolve(node)
        })

      })
    })

  }

  function saveArray(nodes, saved) {
    return new Promise((resolve, reject) => {
      if (nodes.length == 0) {
        console.log('saveArray, nodes is empty, resolving');
        return resolve(saved)
      }

      return doSaveOne(nodes.shift())
      .then((nodeSaved) => {
        console.log('saveArray, didSaveOne.then')
        saved.unshift(nodeSaved)

        // console.log('saveArray, saved node, nodes, saved:', nodes, saved);
        return saveArray(nodes, saved).then((res) => {return resolve(res)})
      })
    })

  }

  const depths = tree.children.map((child) => {
    return child.depth
  })

  return doSave(tree, depths)
  .then(() => {
    return save(tree)
  })
}

function doSaveDeepest(node, depths, maps) {

  console.log('doSaveDeepest', depths);
  const deepest = Math.max(...depths)
  if (deepest == -1) {
    return node
  }

  const deepestIndex = depths.indexOf(deepest)

  // this only saves the terminal node of the deepest path
  var deepestSaved = doSaveDeepestOne(node.children[deepestIndex], maps)
  node.children[deepestIndex] = deepestSaved
  depths[deepestIndex]--

  console.log('doSaveDeepest, didSaveDeepestOne, node', JSON.parse(JSON.stringify(deepestSaved)));
  return doSaveDeepest(node, depths, maps)
  // var i = 0; const len = node.children.length;
  // for (i; i < len; i++) {
  //
  // }

}
// function doSaveDeepestOne(node, depths, branchIndex) {
function doSaveDeepestOne(node, maps) {
  if (node.saved) return node

  // console.log('doSaveDeepestOne', node);

  if (node.type == 'label') {
    if (node.terminalRef) {
      // the flag really just denotes that the node was visited
      // by the doSaveDeepestOne method
      node.saved = true

      // the referenced node is by definition an ancestor of the current node,
      // so we save it for later, because this method traverses in the direction
      // from descendants to ancestors, so to set the id of the referenced node
      // as referee in this node, we need to first save that node.
      maps.terminalRefs.push(node)
      return node
    }

    return doSaveDeepestOne(maps.ids[node.to], maps)
  }

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
  node.children[(unsavedIndexes[deepestIndex])] = doSaveDeepestOne(node.children[(unsavedIndexes[deepestIndex])], maps)

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
    node.children[(unsavedIndexes[deepestIndex])] = doSaveDeepestOne(node.children[(unsavedIndexes[deepestIndex])], maps)
    depths = depths.slice(deepestIndex+1)
    unsavedIndexes = unsavedIndexes.slice(deepestIndex+1)
  }


  node.depth--
  console.log('deepestOne, depth--', node.depth);
  return node
}

function saveDeepest(tree, maps) {

  const depths = tree.children.map((child) => {
    return child.depth
  })

  return doSaveDeepest(tree, depths, maps)
}

module.exports = {saveDeepest, saveDeepestAsync, traverseAsync}
