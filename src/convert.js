function formatDoc(doc) {
  const docFormatted = {}
  // const valPairs = doc.val.map(pair => formatValPair(pair))
  // valPairs.forEach(pair => docFormatted[pair.fieldName] = pair.value)

  doc.val.forEach((pair) => {
    docFormatted[pair.fieldName.val.value] = formatValue(pair.value)
  })

  return docFormatted
}

function formatValue(rule) {
  console.log("formatValue, root rule", rule);

  const valueFormatted = rule.val.map((rule) => {
    console.log("formatValue, rule", rule);
    if (rule.rule === "text") {
      return {
        type: 'text',
        value: rule.val.value
      }
    } else if (rule.rule === "document_pair") {
      return {
        type: "document",
        value: {
          edgeLabel: rule.fieldName.val.value,
          document: formatDoc(rule.val)
        }
      }
    } else if (rule.rule === "document") {
      return { // return formatDoc(rule)
        type: "document",
        value: {
          edgeLabel: "defaultLabel",
          document: formatDoc(rule)
        }
      }
    }
  })

  return valueFormatted

}

const mod = {
  format: (syntaxTree) => {
    const docs = syntaxTree.map(node => formatDoc(node))

    console.log("format, formatted docs:", docs);
    return docs

  },

}

module.exports = mod
