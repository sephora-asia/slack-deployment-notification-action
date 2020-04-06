import {ChatMessage, DeploymentOpts} from './interfaces'
import {
  //ActionsBlock,
  ContextBlock,
  DividerBlock,
  MrkdwnElement,
  PlainTextElement,
  SectionBlock
} from '@slack/types'
import moment from 'moment-timezone'

export function assetUrlFor(opts: DeploymentOpts): string {
  if (opts.status === 'success') {
    return 'https://user-images.githubusercontent.com/35408/78554389-a54f5780-783d-11ea-9657-15dc61ca8262.png'
  } else if (opts.status === 'failure') {
    return 'https://user-images.githubusercontent.com/35408/78554400-a8e2de80-783d-11ea-9f81-17fa426370b5.png'
  } else if (isInitialDeployment(opts)) {
    return 'https://user-images.githubusercontent.com/35408/78554376-a1233a00-783d-11ea-9641-221d29862846.png'
  } else {
    return ''
  }
}

export function statusMessageFor(opts: DeploymentOpts): string {
  if (opts.statusMessage !== undefined && opts.statusMessage.length > 0) {
    return opts.statusMessage
  } else if (isInitialDeployment(opts)) {
    return 'deploying...'
  } else {
    return opts.status || ''
  }
}

export function titleMessageFor(opts: DeploymentOpts): string {
  if (opts.envName !== undefined && opts.envName.length > 0) {
    return `Starting *${opts.envName}* deployment for ${opts.appName}`
  } else {
    return `Starting deployment for ${opts.appName}`
  }
}

export function contextMessageFor(opts: DeploymentOpts): string {
  if (isInitialDeployment(opts)) {
    return `Started at ${formattedTime()}`
  } else if (opts.status === 'success') {
    return `:thumbsup: Completed at ${formattedTime()}`
  } else if (opts.status === 'failed') {
    return `:exclamation: Failed at ${formattedTime()}`
  } else {
    return ''
  }
}

function formattedTime(): string {
  return moment()
    .tz('Asia/Singapore')
    .format('HH:mm:ss Z')
}

function isInitialDeployment(opts: DeploymentOpts): boolean {
  return opts.status === undefined || opts.status.length <= 0
}

export function buildMessage(opts: DeploymentOpts): ChatMessage {
  const fields: (PlainTextElement | MrkdwnElement)[] = [
    {type: 'mrkdwn', text: '*Application*'},
    {type: 'mrkdwn', text: '*Environment*'},
    {type: 'plain_text', text: opts.appName},
    {type: 'plain_text', text: `${opts.envName} `},
    {type: 'plain_text', text: ' '},
    {type: 'plain_text', text: ' '}
  ]
  if (opts.refName !== undefined && opts.refName.length > 0) {
    fields.push(
      {type: 'mrkdwn', text: '*Reference*'},
      {type: 'mrkdwn', text: '*Status*'}
    )
    fields.push(
      {type: 'plain_text', text: opts.refName},
      {type: 'plain_text', text: statusMessageFor(opts)}
    )
  }

  const titleSection: SectionBlock = {
    type: 'section',
    text: {type: 'mrkdwn', text: titleMessageFor(opts)},
    fields,
    accessory: {
      type: 'image',
      // eslint-disable-next-line @typescript-eslint/camelcase
      image_url: assetUrlFor(opts),
      // eslint-disable-next-line @typescript-eslint/camelcase
      alt_text: 'Starting'
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
        text: contextMessageFor(opts)
      }
    ]
  }

  const message: ChatMessage = {
    blocks: [titleSection, dividerSection, linksSection, contextSection]
  }
  return message
}
