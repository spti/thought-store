
/*
  collections
    resources
    entities
    posts
    views
    edges
    edgeLabels

  in resources, the low-level data is stored (from entities)
  entities can reference resources, views and itself (reference views to specify how to display any given resource)
  entities don't have a model (docs in it can have different fields)

  posts reference entities

  an entity could be a piece of content
  it can combine other entities and resources, that together comprise another entity
  an entity can be simply a specification of how to display other entity or resource (there can be multiple ways of displayin one and the same entity/resource)
*/

// this can be used for text, urls, etc
const textResources = {
  type: "object",
  properties: {
    value: {
      type: "string"
    }
  }
}

// this can be used for text, urls, etc
const resourceStr = {
  type: "object",
  properties: {
    value: {
      type: "string"
    }
  }
}

const resources = {
  type: "object",
  properties: {
    oneOf: [resourceStr]
  }
}

const entities = {

}
