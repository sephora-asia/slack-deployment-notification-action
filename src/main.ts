import * as core from '@actions/core'
import {WebClient} from '@slack/web-api'
import {ChatMessage, ChatPostMessageResult} from './interfaces'
import {buildNewDeploymentMessage} from './builders'

async function run(): Promise<void> {
  try {
    // Get the slack token as input and initialise the client
    const slackToken = core.getInput('slackToken')
    core.setSecret(slackToken)
    const slackClient: WebClient = new WebClient(slackToken),
      conversationId = core.getInput('conversationId'),
      statusUpdate = core.getInput('statusUpdate'),
      appName = core.getInput('appName'),
      messageForStatus = (status: string): ChatMessage => {
        if (status === '') {
          return buildNewDeploymentMessage({appName})
        } else {
          return {blocks: []}
        }
      },
      message = messageForStatus(statusUpdate),
      result = (await slackClient.chat.postMessage({
        channel: conversationId,
        text: '',
        blocks: message.blocks
      })) as ChatPostMessageResult

    core.setOutput('messageId', result.ts)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
