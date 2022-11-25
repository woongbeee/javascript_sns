import { Types } from 'mongoose';
import pkg from 'mongoose';
interface Comment {
    _id: Types.ObjectId;
    writer: Types.ObjectId;
    post: Types.ObjectId;
    comment: string;
    createdAt: Date;
}
declare const Comment: pkg.Model<Comment, {}, {}, {}, any>;
export default Comment;
