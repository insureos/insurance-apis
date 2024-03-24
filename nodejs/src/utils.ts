/**
 * @throws {Error}
 */
function checkTransactionSignature(signature: string) {
  // checks if simulated transaction log
  if (signature == '1111111111111111111111111111111111111111111111111111111111111111') {
    throw Error('Simulated transaction');
  }
}
export { checkTransactionSignature };
