Package.describe({
  name: 'komentify:comments-graphql',
  summary: 'GraphQL endpoint for comments-ui',
  version: '0.1.0',
  git: 'https://github.com/komentify/meteor-comments-graphql.git',
})

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.5')

  api.use([
    'check',
    'ecmascript',
    'arkham:comments-ui@1.4.1',
  ], 'server')

  api.mainModule('./graphql.js', 'server')
})
