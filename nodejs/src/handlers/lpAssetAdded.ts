import { LPPool } from '../models/lp';
import { ILPAssetAdded } from '../events';

export const lpAssetAdded = async (res: ILPAssetAdded) => {
  return new Promise(async (resolve, reject) => {
    try {
      let pool = await LPPool.findOne({ pool_pubkey: res.lp.toString() });
      if (pool == null) {
        throw new Error('Pool does not exist');
      }
      pool.total_assets = pool.total_assets + res.assetAmount;
      pool.save();
      resolve('LP asset added succesfully');
    } catch (err) {
      reject(err);
    }
  });
};
