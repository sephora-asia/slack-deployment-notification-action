import * as core from '@actions/core'
import {ChatMessage, DeploymentOpts} from './interfaces'
import {MrkdwnElement, PlainTextElement, SectionBlock} from '@slack/types'

//const assetUrlPrefix = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs`

export function buildNewDeploymentMessage(opts: DeploymentOpts): ChatMessage {
  const fields: (PlainTextElement | MrkdwnElement)[] = [
    {type: 'mrkdwn', text: '*Application*'},
    {type: 'mrkdwn', text: '*Environment*'},
    {type: 'plain_text', text: opts.appName},
    {type: 'plain_text', text: opts.envName === undefined ? '' : opts.envName}
  ]
  if (opts.refName !== undefined && opts.refName.length > 0) {
    fields.push({type: 'mrkdwn', text: ''}, {type: 'mrkdwn', text: ''})
    fields.push({type: 'plain_text', text: opts.refName})
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

  const message: ChatMessage = {blocks: [titleSection]}
  return message
}

export function titleForDeployment(opts: DeploymentOpts): string {
  if (opts.envName !== undefined && opts.envName.length > 0) {
    return `Starting *${opts.envName}* deployment for ${opts.appName}`
  } else {
    return `Starting deployment for ${opts.appName}`
  }
}
