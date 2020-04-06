import {WebAPICallResult} from '@slack/web-api'
import {Block} from '@slack/types'

export interface ChatPostMessageResult extends WebAPICallResult {
  channel: string
  ts: string
  message: {
    text: string
  }
}

export interface ChatMessage {
  blocks: Block[]
}

export enum ContextElements {
  slackToken = 'slackToken',
  conversationId = 'conversationId',
  appName = 'appName',
  envName = 'envName',
  refName = 'refName',
  messageId = 'messageId',
  status = 'status',
  statusMessage = 'statusMessage'
}

export enum Status {
  started = '',
  success = 'success',
  failed = 'failed'
}
