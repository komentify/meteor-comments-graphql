# Meteor Comments GraphQL

Add support for GraphQL to [comments-ui](https://github.com/komentify/meteor-comments-ui).

```js
import { wrapTypeDefsAndResolvers } from 'meteor/komentify:comments-graphql'
import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools'

import { typeDefs, resolvers } from './app'

const schema = makeExecutableSchema(
  wrapTypeDefsAndResolvers({ typeDefs, resolvers }),
)

createApolloServer({ schema, graphiql: true })
```

### How to install

First, install [apollo for meteor](http://dev.apollodata.com/core/meteor.html) and then run

```bash
meteor add komentify:comments-graphql
```
