import {ChatMessage, Status} from './interfaces'
import {
  //ActionsBlock,
  ContextBlock,
  DividerBlock,
  MrkdwnElement,
  PlainTextElement,
  SectionBlock
} from '@slack/types'
import moment from 'moment-timezone'
import {PersistedContext} from './persistedContext'

export function assetUrlFor(context: PersistedContext): string {
  if (context.status === Status.success) {
    return 'https://user-images.githubusercontent.com/35408/78554389-a54f5780-783d-11ea-9657-15dc61ca8262.png'
  } else if (context.status === Status.failed) {
    return 'https://user-images.githubusercontent.com/35408/78554400-a8e2de80-783d-11ea-9f81-17fa426370b5.png'
  } else if (context.status === Status.started) {
    return 'https://user-images.githubusercontent.com/35408/78554376-a1233a00-783d-11ea-9641-221d29862846.png'
  } else {
    return 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif'
  }
}

export function statusMessageFor(context: PersistedContext): string {
  if (context.statusMessage.length > 0) {
    return context.statusMessage
  } else if (context.status === Status.started) {
    return 'deploying...'
  } else {
    return `${context.status} `
  }
}

export function titleMessageFor(context: PersistedContext): string {
  if (context.envName.length > 0) {
    return `*${context.envName}* deployment for ${context.appName}`
  } else {
    return `Deployment for ${context.appName}`
  }
}

export function contextMessageFor(context: PersistedContext): string {
  if (context.status === Status.started) {
    return `Started at ${formattedTime()}`
  } else if (context.status === Status.success) {
    return `:thumbsup: Completed at ${formattedTime()}`
  } else if (context.status === Status.failed) {
    return `:exclamation: Failed at ${formattedTime()}`
  } else {
    return `${context.status} `
  }
}

function formattedTime(): string {
  return moment()
    .tz('Asia/Singapore')
    .format('HH:mm:ss Z')
}

export function buildMessage(context: PersistedContext): ChatMessage {
  const fields: (PlainTextElement | MrkdwnElement)[] = [
    {type: 'mrkdwn', text: '*Application*'},
    {type: 'mrkdwn', text: '*Environment*'},
    {type: 'plain_text', text: `${context.appName} `},
    {type: 'plain_text', text: `${context.envName} `},
    {type: 'plain_text', text: ' '},
    {type: 'plain_text', text: ' '}
  ]
  if (context.refName.length > 0) {
    fields.push(
      {type: 'mrkdwn', text: '*Reference*'},
      {type: 'mrkdwn', text: '*Status*'}
    )
    fields.push(
      {type: 'plain_text', text: `${context.refName}`},
      {type: 'plain_text', text: statusMessageFor(context)}
    )
  }

  const titleSection: SectionBlock = {
    type: 'section',
    text: {type: 'mrkdwn', text: titleMessageFor(context)},
    fields,
    accessory: {
      type: 'image',
      // eslint-disable-next-line @typescript-eslint/camelcase
      image_url: assetUrlFor(context),
      // eslint-disable-next-line @typescript-eslint/camelcase
      alt_text: `${context.status} `
    }
  }
  const dividerSection: DividerBlock = {
    type: 'divider'
  }
  const jobRunUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  // const actionsSection: ActionsBlock = {
  //   type: 'actions',
  //   elements: [
  //     {
  //       type: 'button',
  //       text: {type: 'plain_text', text: 'View Job', emoji: true},
  //       url: jobRunUrl
  //     }
  //   ]
  // }
  const linksSection: SectionBlock = {
    type: 'section',
    text: {type: 'mrkdwn', text: `<${jobRunUrl}|*View Job*>`}
  }
  const contextSection: ContextBlock = {
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: contextMessageFor(context)
      }
    ]
  }

  const message: ChatMessage = {
    blocks: [titleSection, dividerSection, linksSection, contextSection]
  }
  return message
}
