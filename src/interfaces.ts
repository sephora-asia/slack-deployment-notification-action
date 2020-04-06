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
