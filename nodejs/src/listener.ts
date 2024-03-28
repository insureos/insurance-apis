import * as anchor from '@project-serum/anchor';
import { Insurance } from '../type-file/insurance';
import { insurerRegistered } from './handlers/insurerRegistered';
import { IInsurerRegistered } from './events';
import { checkTransactionSignature } from './utils';

export const addEventListener = (program: anchor.Program<Insurance>) => {
  program.addEventListener('VerifiedUserAdded', (res: IInsurerRegistered, _, signature) => {
    checkTransactionSignature(signature);
    insurerRegistered(res)
      .then(() => {
        console.log('Insurer registered');
      })
      .catch((e) => {
        console.log('Error Adding User: ', e);
      });
  });
};

