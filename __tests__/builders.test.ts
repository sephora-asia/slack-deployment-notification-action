import {titleForDeployment} from '../src/builders'

describe('titleForDeployment', () => {
  describe('with environment', () =>{
    it('Returns a full deployment string', async () => {
      expect(titleForDeployment({envName: 'production', appName: 'test'})).
        toEqual('Starting *production* deployment for test')
    })
  })
})
