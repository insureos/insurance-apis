import { IClaimRaised } from '../events';
import { Claim } from '../models/claim';
import { InsuranceProposal } from '../models/insurance_proposal';
export const claimRaised = async (res: IClaimRaised) => {
  return new Promise(async (resolve, reject) => {
    try {
      let reinsurance = await InsuranceProposal.findOne({ proposal_pubkey: res.reinsurance.toString() });
      let claim = new Claim({
        claim_id: res.claimId,
        claim_addr: res.claim.toString(),
        claim_amount: res.claimAmount,
        vote_positive: 0,
        vote_negative: 0,
        voting_start: new Date(),
        voting_ended: false,
        claim_accepted: false,
        // ASK ROHIT FOR JSON STRUCTURE OF DATA HE IS SENDING IN METADATA LINK
        // AND RUN AXIOS GET ON URL TO GET THE CLAIM TITLE
        claim_title: res.claimMetadataLink,
        claim_description: res.claimMetadataLink,
        claim_votes: [],
        reinsurance: reinsurance?._id,
        claim_claimed: false,
      });
      claim.save();
      resolve('Claim raise logged succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
