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
      appName = core.getInput('appName'),
      envName = core.getInput('envName'),
      refName = core.getInput('refName'),
      status = core.getInput('statusUpdate'),
      deploymentOpts = {appName, envName, refName, status},
      messageForStatus = (statusName: string): ChatMessage => {
        if (statusName === '') {
          return buildNewDeploymentMessage(deploymentOpts)
        } else {
          return {blocks: []}
        }
      },
      message = messageForStatus(status),
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
