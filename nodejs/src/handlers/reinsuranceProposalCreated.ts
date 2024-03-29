import { IReInsuranceProposalProposed } from '../events';
import { InsuranceProposal } from '../models/insurance_proposal';
import { Insurance } from '../models/insurance';
import { LPPool } from '../models/lp';

export const reinsuranceProposalCreated = async (res: IReInsuranceProposalProposed) => {
  return new Promise(async (resolve, reject) => {
    try {
      let insurance = await Insurance.findOne({ insurance_pubkey: res.insurance.toString() });
      let lp = await LPPool.findOne({ pool_pubkey: res.lp.toString() });
      if (insurance == null) {
        throw new Error('Insurance does not exist on which proposal is to be sent');
      }
      if (lp == null) {
        throw new Error('LP does not exist which could send this proposal');
      }
      let insurance_proposal = new InsuranceProposal({
        insurance: insurance._id,
        lp: lp._id,
        accepted: false,
        proposal_docs: res.proposalDocs,
        proposed_commision: res.proposedCommision,
        proposed_undercollaterization: res.proposedUndercollaterization,
        premium_due_date: null,
        proposal_pubkey: res.proposal.toString(),
        sent: false,
      });
      insurance_proposal.save();
      resolve('Reinsurance proposal added to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
