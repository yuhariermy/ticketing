import mongoose from 'mongoose';
import { Password } from "../services/password"

// require an Interface that describes the properties of wheneve create a new User

interface UserAttrs {
    email: string;
    password: string;
}

// require an Interface that describes the properties User Model has

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password // ret is for 
            delete ret.__v
        },
    }
})

// Why using function instead arrow function
// Whenever we put together the middleware function, we can get access to the document that is being saved
// and if arrow function, it would be overridden and it will be acctually instead equal to context this entire file
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed)

    }
    done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
