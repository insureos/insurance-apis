import mongoose from 'mongoose';

interface IInsurance {
  created_by: mongoose.Schema.Types.ObjectId;
  coverage: mongoose.Schema.Types.Number;
  premium: mongoose.Schema.Types.Number;
  minimum_commision: mongoose.Schema.Types.Number;
  deductible: mongoose.Schema.Types.Number;
  expiry: mongoose.Schema.Types.Date;
  metadata_link: mongoose.Schema.Types.String;
  reinsured: mongoose.Schema.Types.Boolean;
  insurance_pubkey: mongoose.Schema.Types.String;
}

const InsuranceSchema = new mongoose.Schema<IInsurance>(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverage: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    premium: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    minimum_commision: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    deductible: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    expiry: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    metadata_link: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    reinsured: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
    },
    insurance_pubkey: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  { versionKey: false },
);

export const Insurance = mongoose.model<IInsurance>('Insurance', InsuranceSchema);
