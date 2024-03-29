import { IReInsuranceClaimed } from '../events';
import { Claim } from '../models/claim';
import { InsuranceProposal } from '../models/insurance_proposal';
import { LPPool } from '../models/lp';
export const claimMoneySent = async (res: IReInsuranceClaimed) => {
  return new Promise(async (resolve, reject) => {
    try {
      let claim = await Claim.findOne({ claim_addr: res.claim.toString() });
      let proposal = await InsuranceProposal.findOne({ proposal_pubkey: res.reinsurance.toString() });
      let lp = await LPPool.findById(proposal?.lp);
      claim?.set('claim_claimed', true);
      if (typeof lp?.total_assets != 'number' || typeof claim?.claim_amount != 'number') {
        throw new Error('Undefined total assets or claim amount');
      }
      lp?.set('total_assets', lp?.total_assets - claim?.claim_amount);
      lp?.save();
      claim?.save();
      resolve('Claim money sent logged succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
