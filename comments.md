

# sequential relationship
In afile.txt, the content in the presented markup is to be broken down into a sequence. So, if we're to store this in mongodb, I would store an array, where the first item would be the text within the <head> field, up until 12:20, then the id, presentend in the first double curly braces, then the text from 12:59 to 14:35, then the id of newly stored document, specified in the second curly braces, and then the text from 16:30 to the end of the document.

# semantic relationship
It looks like it would be good to have the edges stored as separate docs, with not only the vertices specified, but also labels.

# database
## entities
### some random, unrelated guesses, ideas
  1. entities is a collection, without restrictions on fields. But it wouldn't be useful to allow for a completely empty entity. At the same time, seems that it wouldnt make sense to ipose any inherent structure on entities, because any structure that she wants, user can create by referencing resources and other entities...
  2. however, in the particular context of the thought-store it seems, that an entity is an array of references - to resources, other entities. Seems that entities dont contain any data themselves, they just reference stuff in a particular order.
