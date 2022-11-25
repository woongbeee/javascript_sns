import pkg from 'mongoose';
const { Schema, model } = pkg;
const commentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    writer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
//type Comment = InferSchemaType<typeof commentSchema>;
const Comment = model('Comment', commentSchema);
export default Comment;
