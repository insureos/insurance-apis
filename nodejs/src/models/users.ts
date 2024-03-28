import mongoose from 'mongoose';

interface IUser {
  user_addr: mongoose.Schema.Types.String,
  user_verifying_documents: mongoose.Schema.Types.String,
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    user_addr: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    user_verifying_documents: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  { versionKey: false },
);

export const User = mongoose.model<IUser>('User', UserSchema);
