import { IProposalSent } from '../events';
import { InsuranceProposal } from '../models/insurance_proposal';

export const reinsuranceProposalSent = async (res: IProposalSent) => {
  return new Promise(async (resolve, reject) => {
    try {
      let insurance_proposal = await InsuranceProposal.findOne({ proposal_pubkey: res.proposal.toString() });
      insurance_proposal?.set('sent', true);
      insurance_proposal?.save();
      resolve('Reinsurance proposal send logged to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
