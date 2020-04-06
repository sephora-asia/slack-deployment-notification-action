import {PersistedContext} from '../src/persistedContext'

describe('main.ts',() => {
  describe('PersistedContext', () => {
    it('correctly sets empty string properties', async () => {
      let context = new PersistedContext()
      expect(context.slackToken).toEqual('')
      expect(context.conversationId).toEqual('')
    })
  })
})
