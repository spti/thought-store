function formatDoc(doc) {
  const docFormatted = {}
  // const valPairs = doc.val.map(pair => formatValPair(pair))
  // valPairs.forEach(pair => docFormatted[pair.fieldName] = pair.value)

  doc.val.forEach((pair) => {
    [docFormatted[pair.fieldName]]: formatValue(pair.value)
  })
}

function formatValue(value) {
  const valueFormatted = value.val.map((rule) => {
    if (rule.rule === "text") {
      return rule.val.value
    } else if (rule.rule === "document_pair") {
      return {
        edgeLabel: rule.fieldName.val.value,
        document: formatDoc(rule.value.val)
      }
    } else if (rule.rule === "document") {
      return formatDoc(rule.val)
    }
  })

}

const mod = {
  format: (syntaxTree) => {
    console.log(syntaxTree)

    const docs = syntaxTree.map(node => formatDoc(node))
  },

}

module.exports = mod
