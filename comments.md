# 0.0.1
This release version roughly coincides with the 0.0.1 version of thought-input_fronted

# sequential relationship
In afile.txt, the content in the presented markup is to be broken down into a sequence. So, if we're to store this in mongodb, I would store an array, where the first item would be the text within the <head> field, up until 12:20, then the id, presentend in the first double curly braces, then the text from 12:59 to 14:35, then the id of newly stored document, specified in the second curly braces, and then the text from 16:30 to the end of the document.

# semantic relationship
It looks like it would be good to have the edges stored as separate docs, with not only the vertices specified, but also labels.

# database
## entities
### some random, unrelated guesses, ideas
  1. entities is a collection, without restrictions on fields. But it wouldn't be useful to allow for a completely empty entity. At the same time, seems that it wouldnt make sense to ipose any inherent structure on entities, because any structure that she wants, user can create by referencing resources and other entities...
  2. however, in the particular context of the thought-store it seems, that an entity is an array of references - to resources, other entities. Seems that entities dont contain any data themselves, they just reference stuff in a particular order.

# the cycle
render to syntax - edit, in syntax - convert to docs - compare each node with it's latest version and tell if it got changed - save new/update changed (, retrieve) nodes - render

For now, to pertain identity for each node, I use ids. When docs are saved to the database, they get ids. But when a tree is represented as syntax, those ids are impractical, because they are long. So, somewhere in the cycle, I ought to create my own ids, which are valid only for the life of one cycle. . ...?

Maybe, within the syntax stage (that is, the ThoughtInputCore), I'd operate only using these pretty ids.. The ThoughtInputCore has two ways of input: throught the textarea, and through the setThoughts. So, maybe, at those points I shall


# the tree format and the map

# handling terminal refs when saving tree
when a node has terminal outgoing refs, we save those refs with patches in place of toTerminal value, because the node those refs refer to isn't saved yet (because it's an ancestor of the current node); we want to keep id of the current node to come back to it later and update the patched refs with ids of the real nodes. const withTerminalRefs = []
