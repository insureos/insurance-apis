import { IReInsuranceProposalAccepted } from '../events';
import { InsuranceProposal } from '../models/insurance_proposal';
import { Insurance } from '../models/insurance';

export const reinsuranceProposalAccepted = async (res: IReInsuranceProposalAccepted) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentDate = new Date(); // Get current datetime
      let insurance_proposal = await InsuranceProposal.findOne({ proposal_pubkey: res.reinsurance.toString() });
      if (insurance_proposal == null) {
        throw new Error('Insurance proposal does not exist which is to be accepted');
      }
      insurance_proposal.set('accepted', true);
      insurance_proposal.set('premium_due_date', currentDate);
      let insurance = await Insurance.findById(insurance_proposal.insurance);
      if (insurance == null) {
        throw new Error('Insurance on which proposal is sent does not exist in db');
      }
      insurance.set('reinsured', true);
      insurance.save();
      insurance_proposal.save();

      resolve('Reinsurance acceptance saved to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
