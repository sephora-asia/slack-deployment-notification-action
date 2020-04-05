import {ChatMessage, DeploymentOpts} from './interfaces'
import {SectionBlock} from '@slack/types'

const assetUrlPrefix = `https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs`

export function buildNewDeploymentMessage(opts: DeploymentOpts): ChatMessage {
  const titleSection: SectionBlock = {
    type: 'section',
    text: {type: 'mrkdwn', text: titleForDeployment(opts)} //,
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
