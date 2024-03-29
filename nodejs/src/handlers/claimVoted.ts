import { IClaimVoted } from '../events';
import { Claim } from '../models/claim';

export const claimVoted = async (res: IClaimVoted) => {
  return new Promise(async (resolve, reject) => {
    try {
      let claim = await Claim.findOne({ claim_addr: res.claim.toString() });
      if (claim == null) {
        throw new Error("Claim to be voted doesn't exist");
      }
      let claim_votes = claim.claim_votes;
      claim_votes.push({
        voter: res.voter.toString(),
        vote_amount: res.voteAmount.toNumber(),
        vote_side: res.voteDirection,
      });
      claim.claim_votes = claim_votes;
      claim.save();
      resolve('Claim voted logged to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
