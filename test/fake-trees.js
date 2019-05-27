const nodes = require('../../thought-store_frontend/src/entities.js')
var id = 0;

function uuid() {
  id++
  return id.toString()
}

const id0 = uuid()

const tree0 = {
  id: uuid(),
  name: "tree0",
  children: [
    {
      id: uuid(),
      name: "tree0_0-0",
      children: [
        {id: uuid(), name: "tree0_10-0", children: []},
        {id: uuid(), name: "tree0_10-1", children: []},
        {id: uuid(), name: "tree0_10-2", children: []},
      ],
    },
    {
      id: uuid(),
      name: "tree0_0-1",
      children: [
        {id: uuid(), name: "tree0_11-0", children: []},
        {id: uuid(), name: "tree0_11-1", children: []},
        {id: uuid(), name: "tree0_11-2", children: []},
      ],
    }
  ]
}

const tree0dbsSparse = {
  id: uuid(),
  name: "tree0",
  coll: "entities",
  children: [
    {
      id: uuid(),
      name: "tree0_0-0",
      coll: "entities",
      children: [
        {id: uuid(), name: "tree0_10-0", coll: "views", children: []},
        {id: uuid(), name: "tree0_10-1", coll: "resources", children: []},
        {id: uuid(), name: "tree0_10-2", coll: "resources", children: []},
      ],
    },
    {
      id: uuid(),
      name: "tree0_0-1",
      coll: "entities",
      children: [
        {id: uuid(), name: "tree0_11-0", coll: "views", children: []},
        {id: uuid(), name: "tree0_11-1", coll: "resources", children: []},
        {id: uuid(), name: "tree0_11-2", coll: "resources", children: []},
      ],
    },
    {
      id: uuid(),
      name: "tree0_0-2",
      coll: "entities",
      children: [
        {id: uuid(), name: "tree0_12-0", coll: "entities", children: [
          {id: uuid(), name: "tree0_20-0", coll: "resources", children: []},
          {id: uuid(), name: "tree0_21-0", coll: "resources", children: []},
        ]},
        {id: uuid(), name: "tree0_12-1", coll: "views", children: []},
        {id: uuid(), name: "tree0_12-2", coll: "resources", children: []},
      ],
    }
  ]
}

const tree0dbsDense = {
  id: uuid(),
  name: "tree0",
  coll: "one",
  children: [
    {
      id: uuid(),
      name: "tree0_0-0",
      coll: "one",
      children: [
        {id: uuid(), name: "tree0_10-0", coll: "one", children: []},
        {id: uuid(), name: "tree0_10-1", coll: "one", children: []},
        {id: uuid(), name: "tree0_10-2", coll: "one", children: []},
      ],
    },
    {
      id: uuid(),
      name: "tree0_0-1",
      coll: "one",
      children: [
        {id: uuid(), name: "tree0_11-0", coll: "one", children: []},
        {id: uuid(), name: "tree0_11-1", coll: "one", children: []},
        {id: uuid(), name: "tree0_11-2", coll: "one", children: []},
      ],
    },
    {
      id: uuid(),
      name: "tree0_0-2",
      coll: "one",
      children: [
        {id: uuid(), name: "tree0_12-0", coll: "one", children: []},
        {id: uuid(), name: "tree0_12-1", coll: "one", children: []},
        {id: uuid(), name: "tree0_12-2", coll: "one", children: []},
      ],
    }
  ]
}

const tree0dbsDeepDense = {
  id: uuid(),
  name: "tree0",
  coll: "one",
  children: [
    {
      id: uuid(),
      name: "tree0_0-0",
      coll: "one",
      children: [
        {id: uuid(), name: "tree0_10-0", coll: "one", children: []},
        {id: uuid(), name: "tree0_10-1", coll: "one", children: []},
        {id: uuid(), name: "tree0_10-2", coll: "one", children: []},
      ],
    },
    {
      id: uuid(),
      name: "tree0_0-1",
      coll: "one",
      children: [
        {
          id: uuid(), name: "tree0_11-0", coll: "one", children: [
            {id: uuid(), name: "tree0_20-0", coll: "one"},
            {id: uuid(), name: "tree0_20-1", coll: "one"},
          ]
        },
        {
          id: uuid(), name: "tree0_11-1", coll: "one", children: [
            {id: uuid(), name: "tree0_21-0", coll: "one"},
            {id: uuid(), name: "tree0_21-1", coll: "one"},
          ]
        },
        {
          id: uuid(), name: "tree0_11-2", coll: "one", children: [
            {id: uuid(), name: "tree0_22-0", coll: "one"},
            {id: uuid(), name: "tree0_22-1", coll: "one"},
          ]
        },
      ],
    },
    {
      id: uuid(),
      name: "tree0_0-2",
      coll: "one",
      children: [
        {id: uuid(), name: "tree0_12-0", coll: "one", children: []},
        {id: uuid(), name: "tree0_12-1", coll: "one", children: []},
        {id: uuid(), name: "tree0_12-2", coll: "one", children: []},
      ],
    }
  ]
}

const tree0syntax = {
  id: uuid(),
  type: "entity",
  name: "tree0",
  children: [
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-0",
      children: [
        {id: uuid(), type: "entity", name: "tree0_10-2", children: [
          {id: uuid(), type: "label", to: "tree0_12-1", name: "tree0_20-0"},
          {id: uuid(), type: "label", to: "tree0_0-1", name: "tree0_20-1"},
        ]},
      ],
    },
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-1",
      children: [
        {id: uuid(), type: "entity", name: "tree0_11-0", children: []},
        {id: uuid(), type: "entity", name: "tree0_11-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_11-2", children: []},
      ],
    },
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-2",
      children: [
        {id: uuid(), type: "entity", name: "tree0_12-0", children: []},
        {id: uuid(), type: "entity", name: "tree0_12-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_12-2", children: []},
      ],
    }
  ]
}

const tree0syntaxCyclic = {
  id: uuid(),
  type: "entity",
  name: "tree0",
  children: [
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-0",
      children: [
        {id: uuid(), type: "entity", name: "tree0_10-0", children: [
          {id: uuid(), type: "label", to: "tree0_0-0", name: "tree0_20-0"},
          // {id: uuid(), type: "label", to: "tree0_0-1", name: "tree0_20-1"},
        ]},
        {id: uuid(), type: "entity", name: "tree0_10-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_10-2", children: []},
      ],
    },
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-1",
      children: [
        {id: uuid(), type: "entity", name: "tree0_11-0", children: []},
        {id: uuid(), type: "entity", name: "tree0_11-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_11-2", children: []},
      ],
    },
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-2",
      children: [
        {id: uuid(), type: "entity", name: "tree0_12-0", children: []},
        {id: uuid(), type: "entity", name: "tree0_12-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_12-2", children: []},
      ],
    }
  ]
}

const tree0syntaxCommonChildren = {
  id: uuid(),
  type: "entity",
  name: "tree0",
  children: [
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-0",
      children: [
        {id: uuid(), type: "entity", name: "tree0_10-0", children: []},
        {id: uuid(), type: "entity", name: "tree0_10-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_10-2", children: []},
      ],
    },
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-1",
      children: [
        {id: uuid(), type: "entity", name: "tree0_11-0", children: [
          {id: uuid(), type: "label", to: "tree0_0-10-0", name: "tree0_21-0"},
        ]},
        {id: uuid(), type: "entity", name: "tree0_11-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_11-2", children: []},
      ],
    },
    {
      id: uuid(),
      type: "entity",
      name: "tree0_0-2",
      children: [
        {id: uuid(), type: "entity", name: "tree0_12-0", children: []},
        {id: uuid(), type: "entity", name: "tree0_12-1", children: []},
        {id: uuid(), type: "entity", name: "tree0_12-2", children: []},
      ],
    }
  ]
}

const tree1 = {
  id: uuid(),
  name: 'tree1',
  children: [
    {
      id: uuid(),
      name: "tree1_0-0",
      children: [
        {id: uuid(), name: "tree1_1-0", children: []},
        {id: uuid(), name: "tree1_1-1", children: []},
        {id: uuid(), name: "tree1_1-2", children: []},
      ],
    },
    {
      id: id0,
      name: 'the ref',
      ref: true,
      children: []
    },
    {
      id: uuid(),
      name: "tree1_0-1",
      children: [
        {id: uuid(), name: "tree1_1-0", children: []},
        {id: uuid(), name: "tree1_1-1", children: []},
        {id: uuid(), name: "tree1_1-2", children: []},
      ],
    }
  ]
}

const tree2 = {
  id: uuid(),
  name: 'tree2',
  children: [
    {
      id: uuid(),
      name: "tree2_0-0",
      children: [
        {
          id: uuid(), name: "tree2_10-0", children: [
            {id: uuid(), name: "tree2_20-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_10-1", children: [
            {id: uuid(), name: "tree2_20-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_10-2", children: [
            {id: uuid(), name: "tree2_20-0", children: []}
          ]
        },
      ],
    },
    {
      id: uuid(),
      name: "tree2_0-1",
      children: [
        {
          id: uuid(), name: "tree2_11-0", children: [
            {id: uuid(), name: "tree2_21-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_11-1", children: [
            {id: uuid(), name: "tree2_21-1", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_11-2", children: [
            {id: uuid(), name: "tree2_21-2", children: []}
          ]
        },
      ],
    },
    {
      id: uuid(),
      name: "tree2_0-2",
      children: [
        {id: uuid(), name: "tree2_12-0", children: [
          // {id: id0, ref: true}
        ]},
        {
          id: uuid(), name: "tree2_12-1", children: [
            {id: uuid(), name: "tree2_22-1", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_12-2", children: [
            {id: uuid(), name: "tree2_22-2", children: []}
          ]
        },
      ],
    },
  ]
}

const tree2variousDepth = {
  id: uuid(),
  name: 'tree2',
  children: [
    {
      id: uuid(),
      name: "tree2_0-0",
      children: [
        {
          id: uuid(), name: "tree2_10-0", children: [
            {id: uuid(), name: "tree2_20-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_10-1", children: [
            {id: uuid(), name: "tree2_20-1", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_10-2", children: [
            {id: uuid(), name: "tree2_20-2", children: [
              {id: uuid(), name: "tree2_30-0", children: [
                {id: uuid(), name: "tree2_40-0", children: [
                  {id: uuid(), name: "tree2_50-0", children: [

                  ]}
                ]}
              ]}
            ]}
          ]
        },
      ],
    },
    {
      id: uuid(),
      name: "tree2_0-1",
      children: [
        {
          id: uuid(), name: "tree2_11-0", children: [
            // {id: uuid(), name: "tree2_21-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_11-1", children: [
            // {id: uuid(), name: "tree2_21-1", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_11-2", children: [
            // {id: uuid(), name: "tree2_21-2", children: []}
          ]
        },
      ],
    },
    {
      id: uuid(),
      name: "tree2_0-2",
      children: [
        {id: uuid(), name: "tree2_12-0", children: [
          // {id: id0, ref: true}
        ]},
        {
          id: uuid(), name: "tree2_12-1", children: [
            {id: uuid(), name: "tree2_22-1", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_12-2", children: [
            {id: uuid(), name: "tree2_22-2", children: []}
          ]
        },
      ],
    },
  ]
}

const tree2entity = {
  id: uuid(),
  name: 'tree2',
  children: [
    {
      id: uuid(),
      name: "tree2_0-0",
      children: [
        {
          id: uuid(), name: "tree2_10-0", type: 'entity', children: [
            {id: uuid(), name: "tree2_20-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_10-1", children: [
            {id: uuid(), name: "tree2_20-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_10-2", type: 'entity', children: [
            {id: uuid(), name: "tree2_20-0", children: []}
          ]
        },
      ],
    },
    {
      id: uuid(),
      type: 'entity',
      name: "tree2_0-1",
      children: [
        {
          id: uuid(), name: "tree2_11-0", children: [
            {id: uuid(), name: "tree2_21-0", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_11-1", children: [
            {id: uuid(), name: "tree2_21-1", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_11-2", type: 'entity', children: [
            {id: uuid(), name: "tree2_21-2", children: []}
          ]
        },
      ],
    },
    {
      id: uuid(),
      name: "tree2_0-1",
      type: 'entity',
      children: [
        {id: uuid(), name: "tree2_12-0", type: 'entity', children: [
          // {id: id0, ref: true}
        ]},
        {
          id: uuid(), name: "tree2_12-1", children: [
            {id: uuid(), name: "tree2_22-1", children: []}
          ]
        },
        {
          id: uuid(), name: "tree2_12-2", children: [
            {id: uuid(), name: "tree2_22-2", children: []}
          ]
        },
      ],
    },
  ]
}
// const idMap = {
//   [id0]: tree0
// }

const thoughtsSimpleNew = {
  root: '-10',
  map: {
    ids: {
      // root node
      '-10': new nodes.Entity([
        {to: '00', coll: 'resources'},
        {to: '01', coll: 'entities'},
        {to: '02', coll: 'resources'},
        {to: '03', coll: 'entities'},
      ], {status: 'new', id: '-10'}),


      '00': new nodes.Resource('a', {status: 'new', id: '00'}),

      '01': new nodes.Entity(
        [{to: '10', coll: 'resources'}],
        {status: 'new', id: '01'}
      ),
      '10': new nodes.Resource('doc', {status: 'new', id: '10'}),

      '02': new nodes.Resource('here', {status: 'new', id: '02'}),

      '03': new nodes.Entity(
        [{to: '30', coll: 'resources'}],
        {status: 'new', id: '03'}
      ),
      '30': new nodes.Resource('one more doc', {status: 'new', id: '30'}),
    }
  }
}

const thoughtsSimpleChanged = {
  root: '-10',
  map: {
    ids: {
      // root node
      '-10': new nodes.Entity([
        {to: '00', coll: 'resources'},
        {to: '01', coll: 'entities'},
        {to: '02', coll: 'resources'},
        {to: '03', coll: 'entities'},
      ], {status: 'changed', id: '-10'}),


      '00': new nodes.Resource('a', {status: 'unchanged', id: '00'}),

      '01': new nodes.Entity(
        [{to: '10', coll: 'resources'}],
        {status: 'unchanged', id: '01'}
      ),
      '10': new nodes.Resource('doc', {status: 'unchanged', id: '10'}),

      '02': new nodes.Resource('here', {status: 'unchanged', id: '02'}),

      '03': new nodes.Entity(
        [{to: '30', coll: 'resources'}],
        {status: 'new', id: '03'}
      ),
      '30': new nodes.Resource('one more doc', {status: 'new', id: '30'}),
    }
  }
}

module.exports = {
  tree0,
  tree0syntax,
  tree0syntaxCyclic,
  tree0syntaxCommonChildren,
  tree0dbsSparse,
  tree0dbsDense,
  tree0dbsDeepDense,
  tree1,
  tree2,
  tree2entity,
  tree2variousDepth,
  thoughtsSimpleNew
}
