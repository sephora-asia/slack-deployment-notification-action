import * as core from '@actions/core'
import {WebClient} from '@slack/web-api'
import {ChatPostMessageResult, ContextElements} from './interfaces'
import {buildMessage} from './builders'
import {PersistedContext} from './persistedContext'

async function run(): Promise<void> {
  try {
    const context = new PersistedContext()

    const slackClient: WebClient = new WebClient(context.slackToken)

    const message = buildMessage(context)
    const baseOptions = {
      channel: context.conversationId,
      text: '',
      blocks: message.blocks
    }

    let result: ChatPostMessageResult | undefined
    if (context.messageId.length > 0) {
      result = (await slackClient.chat.update({
        ...baseOptions,
        // eslint-disable-next-line @typescript-eslint/camelcase
        as_user: true,
        ts: context.messageId
      })) as ChatPostMessageResult
    } else {
      result = (await slackClient.chat.postMessage({
        ...baseOptions
      })) as ChatPostMessageResult
    }
    context.setEnvVarForProperty(ContextElements.messageId, result.ts)
    core.setOutput('messageId', result.ts)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
