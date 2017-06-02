import { check, Match } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import userService from 'meteor/arkham:comments-ui/lib/services/user'
import commentService from 'meteor/arkham:comments-ui/lib/services/comment'

import { commentTypeDef } from './commentTypeDef'

const CommentsCollection = Comments.getCollection()

const rootIdTransform = root => fieldFromRoot('_id')(root)
const fieldFromRoot = field => root => root[field]

/**
 * Generate type definitions and resolvers for the comments-ui pkg.
 *
 * @see https://github.com/komentify/meteor-comments-ui
 */
export const wrapTypeDefsAndResolvers = ({ resolvers = {}, typeDefs = [] }) => {
  if (!Array.isArray(typeDefs)) typeDefs = [typeDefs]

  return {
    typeDefs: [
      ...typeDefs,
      commentTypeDef,
    ],
    resolvers: {
      ...resolvers,

      CommentUser: {
        id: rootIdTransform,
        comments: root => Comments.getCollection().findPublic({ userId: root._id }).fetch(),
      },
      Comment: {
        id: rootIdTransform,
        replies: root => commentService.filterOutNotApprovedReplies(root.replies, null),
        isReply: root => !!fieldFromRoot('replyId')(root),
        user: (root) => userService.getUserById(root.userId),
        media: ({ media }) => (Object.keys(media).length === 0 ? null : media),
      },
      Query: {
        ...(resolvers.Query || {}),
        getComment(root, args, context) {
          const { id } = args
          check(id, String)

          return CommentsCollection.findOnePublic(id)
        },
        listComments(root, args, context) {
          const { referenceId, limit, skip } = args
          check(referenceId, String)

          const userId = null

          return CommentsCollection
            .findPublic({ referenceId }, userId, { limit, skip })
            .fetch()
        },
        countComments(root, args, context) {
          const { referenceId } = args
          check(referenceId, String)

          const userId = null

          return CommentsCollection
            .findPublic({ referenceId }, userId)
            .count()
        }
      },
      Mutation: {
        ...(resolvers.Mutation || {}),
      },
    },
  }
}
