import mongoose from 'mongoose';

export interface ILPPoolToken {
  lp_token_name: mongoose.Schema.Types.String;
  lp_token_symbol: mongoose.Schema.Types.String;
  lp_token_metadata_uri: mongoose.Schema.Types.String;
}

interface ILpPool {
  pool_name: mongoose.Schema.Types.String;
  created_by: mongoose.Schema.Types.String;
  total_assets: mongoose.Schema.Types.Number;
  total_liabilties: mongoose.Schema.Types.Number;
  tokenised: ILPPoolToken;
  pool_created_at: mongoose.Schema.Types.Date;
  target_pool_size: mongoose.Schema.Types.Number;
  pool_lifecycle: mongoose.Schema.Types.Date;
  tokens_sold_last_month: mongoose.Schema.Types.Number;
  pool_pubkey: mongoose.Schema.Types.String;
}

const LPPoolTokenSchema = new mongoose.Schema<ILPPoolToken>({
  lp_token_name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  lp_token_metadata_uri: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  lp_token_symbol: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

const LPPoolSchema = new mongoose.Schema<ILpPool>(
  {
    pool_name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    total_assets: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    total_liabilties: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    tokenised: {
      type: LPPoolTokenSchema,
      required: true,
    },
    pool_created_at: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    target_pool_size: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    pool_lifecycle: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    tokens_sold_last_month: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    pool_pubkey: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  { versionKey: false },
);

export const LPPool = mongoose.model<ILpPool>('LPPool', LPPoolSchema);
