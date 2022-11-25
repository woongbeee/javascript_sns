import { InferSchemaType } from 'mongoose';
import pkg from 'mongoose';
declare const userSchema: pkg.Schema<any, pkg.Model<any, any, any, any, any>, {}, {}, {}, {}, "type", {
    nickname: string;
    email: string;
    password: string;
    profile: string;
    createdAt: Date;
    post: {
        type?: pkg.Types.ObjectId | undefined;
        ref?: unknown;
    }[];
    follower: {
        type?: pkg.Types.ObjectId | undefined;
        ref?: unknown;
    }[];
    following: {
        type?: pkg.Types.ObjectId | undefined;
        ref?: unknown;
    }[];
    _id?: pkg.Types.ObjectId | undefined;
}>;
declare type User = InferSchemaType<typeof userSchema>;
declare const User: pkg.Model<{
    nickname: string;
    email: string;
    password: string;
    profile: string;
    createdAt: Date;
    post: {
        type?: pkg.Types.ObjectId | undefined;
        ref?: unknown;
    }[];
    follower: {
        type?: pkg.Types.ObjectId | undefined;
        ref?: unknown;
    }[];
    following: {
        type?: pkg.Types.ObjectId | undefined;
        ref?: unknown;
    }[];
    _id?: pkg.Types.ObjectId | undefined;
}, {}, {}, {}, any>;
export default User;
