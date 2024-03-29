import { IStrategyVoted } from '../events';
import { StrategyProposal } from '../models/strategy';

export const strategyProposalVoted = async (res: IStrategyVoted) => {
  return new Promise(async (resolve, reject) => {
    try {
      let strategy_proposal = await StrategyProposal.findOne({ proposal_pubkey: res.strategy.toString() });
      strategy_proposal?.set('vote', strategy_proposal?.vote + res.vote_amount.toNumber());
      strategy_proposal?.save();
      resolve('Strategy proposal vote logged to db');
    } catch (err) {
      reject(err);
    }
  });
};
