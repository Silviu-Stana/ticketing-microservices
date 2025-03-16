import mongoose from 'mongoose';
import { Password } from '../services/password';

//Required props to create user
interface UserAttributes {
    email: string;
    password: string;
}

//Props that a UserModel has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttributes): UserDoc;
}

//Props that a SINGLE user has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    // this is where would list additional properties if we had them like "createdAt" "updatedAt"
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        //This helps us override JSON.stringify() to return in postman when creating a user a modified object with "_id" named "id" so Mongoose will now match other database types in naming convention (across different microservices that use different backend)
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttributes) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const user = User.build({
//     email: 'test',
//     password: 'awd',
// });

export { User };
