import {ChatMessage, DeploymentOpts} from './interfaces'
import {
  ActionsBlock,
  ContextBlock,
  DividerBlock,
  MrkdwnElement,
  PlainTextElement,
  SectionBlock
} from '@slack/types'
import moment from 'moment-timezone'

//const assetUrlPrefix = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs`

export function buildNewDeploymentMessage(opts: DeploymentOpts): ChatMessage {
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
      {type: 'plain_text', text: 'Deploying...'}
    )
  }

  const titleSection: SectionBlock = {
    type: 'section',
    text: {type: 'mrkdwn', text: titleForDeployment(opts)},
    fields
    // accessory: {
    //   type: 'image',
    //   // eslint-disable-next-line @typescript-eslint/camelcase
    //   image_url: `${assetUrlPrefix}/solid/play-circle.svg`,
    //   // eslint-disable-next-line @typescript-eslint/camelcase
    //   alt_text: 'Starting'
    // }
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
        text: `Started at ${moment()
          .tz('Asia/Singapore')
          .format('HH:mm:ss z')}`
      }
    ]
  }

  const message: ChatMessage = {
    blocks: [titleSection, dividerSection, linksSection, contextSection]
  }
  return message
}

export function titleForDeployment(opts: DeploymentOpts): string {
  if (opts.envName !== undefined && opts.envName.length > 0) {
    return `Starting *${opts.envName}* deployment for ${opts.appName}`
  } else {
    return `Starting deployment for ${opts.appName}`
  }
}
