
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
const textResource = {
  bsonType: "object",
  properties: {
    text: {
      bsonType: "string"
    }
  }
}

const urlResource = {
  bsonType: "object",
  properties: {
    url: {
      bsonType: "string"
    }
  }
}

const resources = {
  bsonType: "object",
  oneOf: [textResource, urlResource]
}

const entities = {

}

module.exports = {resources}
