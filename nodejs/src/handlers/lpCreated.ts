import { LPPool } from '../models/lp';
import { ILPCreated } from '../events';

export const lpCreated = async (res: ILPCreated) => {
  return new Promise(async (resolve, reject) => {
    try {
      let currentDateTime = new Date();
      let poolExpiry = new Date(1000 * res.poolLifecycle);
      let lp = new LPPool({
        pool_name: res.tokenName,
        created_by: res.lpCreator.toString(),
        total_assets: 0,
        total_liabilties: 0,
        tokens_sold_last_month: 0,
        target_pool_size: res.idealSize,
        tokenised: {
          lp_token_name: res.tokenName,
          lp_token_symbol: res.tokenSymbol,
          lp_token_metadata_uri: res.tokenMetadataUri,
        },
        pool_created_at: currentDateTime,
        pool_lifecycle: poolExpiry,
        pool_pubkey: res.lp.toString(),
      });
      lp.save();
      resolve('LP added to db succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
