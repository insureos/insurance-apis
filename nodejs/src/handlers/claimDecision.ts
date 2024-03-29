import { IClaimDecisionReleased } from '../events';
import { Claim } from '../models/claim';

export const claimDecisionReleased = async (res: IClaimDecisionReleased) => {
  return new Promise(async (resolve, reject) => {
    try {
      let claim = await Claim.findOne({ claim_addr: res.claim.toString() });
      claim?.set('claim_accepted', res.decision);
      claim?.save();
      resolve('Claim decision logged successfully');
    } catch (err) {
      reject(err);
    }
  });
};
