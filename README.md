# Meteor Comments GraphQL

Add support for GraphQL to [comments-ui](https://github.com/komentify/meteor-comments-ui).

Work in progress

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
