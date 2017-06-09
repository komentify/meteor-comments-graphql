import userService from 'meteor/arkham:comments-ui/lib/services/user'
import commentService from 'meteor/arkham:comments-ui/lib/services/comment'

const fieldFromRoot = field => root => root[field]
const rootIdTransform = root => fieldFromRoot('_id')(root)

export const CommentUserResolver = {
  id: rootIdTransform,
  comments: root => Comments.getCollection().findPublic({ userId: root._id }).fetch(),
}

export const getCommentResolver = (getUserId) => ({
  id: root => (root.replyId ? root.replyId : root._id),
  rootId: root => root.replyId ? root._id : null,
  replies: (root, args, context) => commentService.filterOutNotApprovedReplies(
    root.replies,
    getUserId(context),
  ),
  isReply: root => !!fieldFromRoot('replyId')(root),
  user: (root) => userService.getUserById(root.userId),
  media: ({ media }) => (Object.keys(media).length === 0 ? null : media),
})
