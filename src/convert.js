function formatDoc(doc) {
  const docFormatted = {}
  const valPairs = doc.val.map(pair => formatValPair(pair))

  valPairs.forEach(pair => docFormatted[pair.fieldName] = pair.value)
}

function formatValPair() {
  
}

function formatDocPair() {

}

function formatValue() {

}

const mod = {
  format: (syntaxTree) => {
    console.log(syntaxTree)

    const docs = syntaxTree.map(node => formatDoc(node))
  },

}

module.exports = mod
