import purposeVerifConstant from './purposeVerifConstant';
import voteTypeConstant from './voteTypeConstant';

export default {
  [purposeVerifConstant.VERIFY_BEM_VOTE]: voteTypeConstant.BEM,
  [purposeVerifConstant.VERIFY_BPM_VOTE]: voteTypeConstant.BPM,
  [purposeVerifConstant.VERIFY_HIMA_VOTE]: voteTypeConstant.HIMA,
};
