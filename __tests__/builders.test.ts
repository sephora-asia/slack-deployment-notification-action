import {titleMessageFor} from '../src/builders'
import {PersistedContext} from '../src/persistedContext'

describe('titleMessageFor', () => {
  describe('with environment', () => {
    it('Returns a full deployment string', async () => {
      expect(
        titleMessageFor({
          slackToken: '',
          conversationId: '',
          envName: 'production',
          appName: 'test',
          status: '',
          statusMessage: ''
        } as PersistedContext)
      ).toEqual('*production* deployment for test')
    })
  })
})
