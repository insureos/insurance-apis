import { IPremiumPayed } from '../events';
import { InsuranceProposal } from '../models/insurance_proposal';

export const premiumPayed = async (res: IPremiumPayed) => {
  return new Promise(async (resolve, reject) => {
    try {
      let insurance_proposal = await InsuranceProposal.findOne({ proposal_pubkey: res.reinsurance.toString() });
      insurance_proposal?.set('premium_vault', res.premiumVault.toString());
      if (!insurance_proposal) {
        throw new Error('insurance_proposal is not defined.');
      }
      if (!insurance_proposal.premium_due_date) {
        throw new Error('insurance_proposal does not have a valid premium_due_date.');
      }
      const newDate = new Date(res.prepaymentTime.toNumber());
      insurance_proposal.set('premium_due_date', newDate);
      insurance_proposal?.save();
      resolve('Premium payed on reinsurance logged to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
