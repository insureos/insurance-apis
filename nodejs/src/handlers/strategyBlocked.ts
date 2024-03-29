import { IStrategyBlocked } from '../events';
import { StrategyProposal } from '../models/strategy';

export const strategyBlocked = async (res: IStrategyBlocked) => {
  return new Promise(async (resolve, reject) => {
    try {
      let strategy_proposal = await StrategyProposal.findOne({ proposal_pubkey: res.strategy.toString() });
      strategy_proposal?.set('blocked', true);
      strategy_proposal?.save();
      resolve('Strategy block logged to db');
    } catch (err) {
      reject(err);
    }
  });
};
