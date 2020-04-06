import {titleMessageFor} from '../src/builders'

describe('titleMessageFor', () => {
  describe('with environment', () =>{
    it('Returns a full deployment string', async () => {
      expect(titleMessageFor({slackToken: '', conversationId: '', envName: 'production', appName: 'test', status: '', statusMessage: ''})).
        toEqual('*production* deployment for test')
    })
  })
})
