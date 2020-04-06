import * as core from '@actions/core'

export class PersistedContext {
  slackToken: string = ''
  conversationId: string = ''
  appName: string = ''
  envName: string = ''
  refName: string = ''
  messageId: string = ''
  status: string = ''
  statusMessage: string = ''
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    this.getAndSetVarFromContext(ContextElements.slackToken, true, true)
    this.getAndSetVarFromContext(ContextElements.conversationId)
    this.getAndSetVarFromContext(ContextElements.appName)
    this.getAndSetVarFromContext(ContextElements.envName)
    this.getAndSetVarFromContext(ContextElements.refName)
    this.getAndSetVarFromContext(ContextElements.messageId)
    this.getAndSetVarFromContext(ContextElements.status, false)
    this.getAndSetVarFromContext(ContextElements.statusMessage, false)
  }

  getAndSetVarFromContext(
    varName: ContextElements,
    persist: boolean = true,
    secret: boolean = false
  ): void {
    if (core.getInput(varName).length > 0) {
      this[varName] = core.getInput(varName)
    } else {
      this[varName] = process.env[this.getEnvVarForProperty(varName)] || ''
    }
    if (this[varName].length > 0) {
      if (secret) {
        core.setSecret(this[varName])
      }
      if (persist) {
        this.setEnvVarForProperty(varName, this[varName])
      }
    }
  }

  getEnvVarForProperty(varName: ContextElements): string {
    return `DEP_NOTIF_${toUpperSnakeCase(varName)}`
  }

  setEnvVarForProperty(varName: ContextElements, value: string): void {
    core.exportVariable(this.getEnvVarForProperty(varName), value)
  }
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

const toUpperSnakeCase = (str: string): string => {
  return (
    str.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    ) || []
  )
    .map(x => x.toUpperCase())
    .join('_')
}
