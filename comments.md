

# sequential relationship
In afile.txt, the content in the presented markup is to be broken down into a sequence. So, if we're to store this in mongodb, I would store an array, where the first item would be the text within the <head> field, up until 12:20, then the id, presentend in the first double curly braces, then the text from 12:59 to 14:35, then the id of newly stored document, specified in the second curly braces, and then the text from 16:30 to the end of the document.

# semantic relationship
It looks like it would be good to have the edges stored as separate docs, with not only the vertices specified, but also labels.
