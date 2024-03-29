import { IStrategyExecuted } from '../events';
import { StrategyProposal } from '../models/strategy';

export const strategyExecuted = async (res: IStrategyExecuted) => {
  return new Promise(async (resolve, reject) => {
    try {
      let strategy_proposal = await StrategyProposal.findOne({ proposal_pubkey: res.strategy.toString() });
      if (!strategy_proposal) {
        throw new Error('Strategy proposal not found to execute in db');
      }
      let number_of_streams = strategy_proposal.number_of_streams;
      if (typeof number_of_streams != 'number') {
        throw new Error('Number of streams in incorrectly provided');
      }
      strategy_proposal.set('number_of_streams', number_of_streams - 1);
      strategy_proposal.save();
      resolve('Strategy execution added to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
