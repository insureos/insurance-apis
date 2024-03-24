import { IInsurerRegistered } from '../events';
import { User } from '../models/users';

export const insurerRegistered = async (res: IInsurerRegistered) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = new User({
        user_addr: res.insuranceCreator.toString(),
        user_verifying_documents: res.verifyingDocuments,
      });
      user.save();
      resolve('User added to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
