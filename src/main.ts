import * as core from '@actions/core'
import {WebClient} from '@slack/web-api'
import {ChatPostMessageResult} from './interfaces'
import {buildMessage} from './builders'

async function run(): Promise<void> {
  try {
    // Get the slack token as input and initialise the client
    const slackToken = core.getInput('slackToken')
    core.setSecret(slackToken)
    const slackClient: WebClient = new WebClient(slackToken),
      conversationId = core.getInput('conversationId'),
      appName = core.getInput('appName'),
      envName = core.getInput('envName'),
      refName = core.getInput('refName'),
      messageId = core.getInput('messageId'),
      status = core.getInput('statusUpdate'),
      statusMessage = core.getInput('statusMessage'),
      deploymentOpts = {
        appName,
        envName,
        refName,
        messageId,
        status,
        statusMessage
      }

    const message = buildMessage(deploymentOpts)

    let result: ChatPostMessageResult | undefined
    if (messageId !== undefined && messageId.length > 0) {
      result = (await slackClient.chat.update({
        channel: conversationId,
        // eslint-disable-next-line @typescript-eslint/camelcase
        as_user: true,
        ts: messageId,
        text: '',
        blocks: message.blocks
      })) as ChatPostMessageResult
    } else {
      result = (await slackClient.chat.postMessage({
        channel: conversationId,
        text: '',
        blocks: message.blocks
      })) as ChatPostMessageResult
    }

    core.setOutput('messageId', result.ts)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
