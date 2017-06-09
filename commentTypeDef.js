//language=GraphQL Schema
export const commentTypeDef = `

enum CommentSortingField {
  createdAt
  ratingScore
}
  
# Used to define what to sort by
input CommentSortingInput {
  # Field to sort by
  field: CommentSortingField!
  # 1 or -1
  direction: Int
}

# Anonymous user data structure
input CommentAnonData {
  id: String!
  salt: String!
}

# Represents **comment media**
# such as a youtube video, image link, video link etc.
type CommentMedia {
  type: String!
  content: String!
}

# Represents a **user** that left a comment.
# Can be anonymous if configured by comments pkg
type CommentUser {
  id: String!
  displayName: String!
  isAnonymous: Boolean!
  comments: [Comment]
}

# Represents a **comment** with nested replies and user metadata.
# Can also represent a **reply**, which is distinguishable by the isReply field.
type Comment {
  id: String!
  # Identifier of root comment if reply
  rootId: String
  # Status: approved, pending
  status: String!
  # Comment Topic Identifier.
  # Provided to differentiate between topics. 
  # For example the blog post id that's discussed
  referenceId: String!
  content: String!

  user: CommentUser! 

  likesCount: Int!
  dislikesCount: Int!
  # Rating score.
  # * if likes and dislikes => likes substracted by dislikes
  # * if star rating => avg of stars given
  ratingScore: Float!

  createdAt: String!
  lastUpdatedAt: String

  media: CommentMedia

  isReply: Boolean!
  replies: [Comment] 
}

extend type Query {
  getComment(id: String!): Comment
  listComments(
    referenceId: String! 
    limit: Int!
    skip: Int
    sorting: CommentSortingInput
  ): [Comment]
  countComments(referenceId: String!): Int!
}

extend type Mutation {
  addComment(referenceId: String! content: String! anonData: CommentAnonData): Comment
  editComment(id: String! content: String! anonData: CommentAnonData): Comment
  removeComment(id: String! anonData: CommentAnonData): Comment
  likeComment(id: String! anonData: CommentAnonData): Comment
  dislikeComment(id: String! anonData: CommentAnonData): Comment
  starComment(id: String! starsCount: Int anonData: CommentAnonData): Comment
}
`
