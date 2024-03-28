import mongoose from 'mongoose';

interface IInsurance {
  insurance_account:mongoose.Schema.Types.String;
  insurer_id: mongoose.Schema.Types.String;
  insuranceId: mongoose.Schema.Types.String;
  coverage: mongoose.Schema.Types.Number;
  premium: mongoose.Schema.Types.Number;
  minimumCommission: mongoose.Schema.Types.Number;
  deductible: mongoose.Schema.Types.Number;
  expiry: mongoose.Schema.Types.Number;
  metadataLink: mongoose.Schema.Types.String;
}

const InsuranceSchema = new mongoose.Schema<IInsurance>(
  {
    insurance_account: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    insurer_id: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    insuranceId: {
      type: mongoose.Schema.Types.String,
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
    minimumCommission: {
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
    metadataLink: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  { versionKey: false },
);

export const Insurance = mongoose.model<IInsurance>('Insurance', InsuranceSchema);
