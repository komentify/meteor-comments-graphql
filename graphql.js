import { check, Match } from 'meteor/check'
import { Meteor } from 'meteor/meteor'

import { commentTypeDef } from './commentTypeDef'
import { CommentUserResolver, getCommentResolver } from './commentResolvers'

const CommentsCollection = Comments.getCollection()

const transformAnonData = data => data ? { _id: data.id, salt: data.salt } : data

const callCollectionMethod = (method, args, paramsArray, userId) => CommentsCollection[method](
  ...paramsArray.map(key => args[key]),
  userId,
  transformAnonData(args.anonData),
)

/**
 * Generate type definitions and resolvers for the comments-ui pkg.
 *
 * @see https://github.com/komentify/meteor-comments-ui
 */
export const wrapTypeDefsAndResolvers = (opts) => {
  let {
    resolvers = {},
    typeDefs = [],
    getUserId = (context) => context.userId,
  } = opts

  if (!Array.isArray(typeDefs)) typeDefs = [typeDefs]

  return {
    typeDefs: [
      ...typeDefs,
      commentTypeDef,
    ],
    resolvers: {
      ...resolvers,
      CommentUser: CommentUserResolver,
      Comment: getCommentResolver(getUserId),
      Query: {
        ...(resolvers.Query || {}),
        getComment(_, args, context) {
          const { id } = args
          check(id, String)

          return CommentsCollection.findOnePublic(id, getUserId(context))
        },
        listComments(_, args, context) {
          const { referenceId, limit, skip } = args
          check(referenceId, String)

          return CommentsCollection
            .findPublic({ referenceId }, getUserId(context), { limit, skip })
            .fetch()
        },
        countComments(_, args, context) {
          const { referenceId } = args
          check(referenceId, String)

          return CommentsCollection
            .findPublic({ referenceId }, getUserId(context))
            .count()
        },
      },
      Mutation: {
        ...(resolvers.Mutation || {}),
        addComment(_, args, context) {
          return callCollectionMethod('addComment', args, [
            'referenceId',
            'content',
          ], getUserId(context))
        },
        editComment(_, args, context) {
          return callCollectionMethod('editComment', args, [
            'id',
            'content',
          ], getUserId(context))
        },
        removeComment(_, args, context) {
          return callCollectionMethod('removeComment', args, ['id'], getUserId(context))
        },
        likeComment: async (_, args, context) => {
          await callCollectionMethod('likeComment', args, ['id'], getUserId(context))
          return CommentsCollection.findOnePublic(args.id, getUserId(context))
        },
        dislikeComment: async (_, args, context) => {
          await callCollectionMethod('dislikeComment', args, ['id'], getUserId(context))
          return CommentsCollection.findOnePublic(args.id, getUserId(context))
        },
        starComment: async (_, args, context) => {
          await callCollectionMethod('starComment', args, [
            'id',
            'starsCount',
          ], getUserId(context))
          return CommentsCollection.findOnePublic(args.id, getUserId(context))
        },
      },
    },
  }
}
