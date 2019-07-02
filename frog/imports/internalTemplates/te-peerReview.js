// @flow

export const config = {
  type: 'object',
  properties: {
    plane: {
      type: 'string',
      title: 'Individual or group writing',
      enum: ['individual', 'group'],
      default: 'individual'
    },
    writingPrompt: { type: 'rte', title: 'Initial writing prompt' },
    n_to_review: {
      title: 'How many items should each student/group review',
      type: 'number',
      default: 1
    },
    reviewPrompt: { title: 'Review prompt', type: 'rte' },
    revisionPrompt: { title: 'Revision prompt', type: 'rte' },
    showAll: {
      type: 'boolean',
      title: 'Send all contributions to the projector after revising?'
    }
  }
};

const meta = {
  name: 'Peer review template',
  shortDesc: `Students write, review their peers' contributions, and revise their own texts`
};

export default { id: 'te-peerReview', config, meta };
