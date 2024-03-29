import { IStrategyAccepted } from '../events';
import { StrategyProposal } from '../models/strategy';

export const strategyAccepted = async (res: IStrategyAccepted) => {
  return new Promise(async (resolve, reject) => {
    try {
      let strategy_proposal = await StrategyProposal.findOne({ proposal_pubkey: res.strategy.toString() });
      strategy_proposal?.set('accepted', true);
      strategy_proposal?.save();
      resolve('Strategy Acceptance logged to db');
    } catch (err) {
      reject(err);
    }
  });
};
