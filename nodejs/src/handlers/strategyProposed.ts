import { IStrategyProposed } from '../events';
import { StrategyProposal, Strategy } from '../models/strategy';
import { InsuranceProposal } from '../models/insurance_proposal';
export const strategyProposed = async (res: IStrategyProposed) => {
  return new Promise(async (resolve, reject) => {
    try {
      let strategy = await Strategy.findOne({ strategy: res.strategy.toString() });
      let insurance_proposal = await InsuranceProposal.findOne({ premium_vault: res.premiumVault.toString() });
      if (insurance_proposal == null) {
        throw new Error('Insurance proposal on which strategy proposed is not in DB');
      }
      let strategy_proposal = new StrategyProposal({
        strategy_program: strategy?._id,
        insurance_proposal: insurance_proposal,
        stream_amount: res.streamAmount,
        stream_every: res.streamEvery,
        number_of_streams: res.numberOfStreams,
        strategy_id: res.strategyId,
        vote: 0,
        accepted: false,
        blocked: false,
        proposal_pubkey: res.strategy.toString(),
      });
      strategy_proposal.save();
      resolve('Strategy proposal added to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
