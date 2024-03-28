import { IInsuranceCreated } from "../events";
import { Insurance } from "../models/insurance";
import { User } from "../models/users";

export const insuranceRegistered = async (res: IInsuranceCreated) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findOne({user_addr: res.insurer.toString()})
        if(user==null){
          throw new Error("User does not exist that could create this insurance")
        }
        let insurance = new Insurance({
            created_by: user._id,
            coverage: res.coverage,
            premium: res.premium,
            minimum_commision: res.minimumCommission,
            deductible: res.deductible,
            expiry: res.expiry,
            metadata_link: res.metadataLink,
            reinsured: false,
            insurance_pubkey: res.insurance
        })
        insurance.save()
        resolve('Insurance added to db succesfully');
      } catch (err) {
        reject(err);
      }
    });
  };
  