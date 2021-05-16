import Serverless, { Options } from 'serverless'
import { flatten, MixedEnvironment } from './flatten'

interface ProviderEnvironment {
  configurationInput: {
    provider: {
      environment: MixedEnvironment
    }
  }
}

type Thunk = () => unknown

class ServerlessEnvObj {
  commands: Record<string, unknown>
  hooks: { [key: string]: Thunk }

  constructor(
    private serverless: Serverless & ProviderEnvironment,
    private options: Options
  ) {
    this.commands = {
      welcome: {
        usage: 'Helps you start your first Serverless plugin',
        lifecycleEvents: ['hello', 'world'],
        options: {
          message: {
            usage:
              'Specify the message you want to deploy ' +
              '(e.g. "--message \'My Message\'" or "-m \'My Message\'")',
            required: true,
            shortcut: 'm',
          },
        },
      },
    }

    this.hooks = {
      initialize: this.logEnv.bind(this),
      'package:initialize': this.logEnv.bind(this),
      'welcome:hello': this.welcomeUser.bind(this),
      'welcome:world': this.displayHelloMessage.bind(this),
      'after:welcome:world': this.afterHelloWorld.bind(this),
    }
  }

  logEnv() {
    this.serverless.service
      .getAllFunctions()
      .map((functionName) => this.serverless.service.getFunction(functionName))
      .forEach(
        (func) =>
          (func.environment = func.environment
            ? flatten(func.environment)
            : func.environment)
      )
    this.serverless.configurationInput.provider.environment = flatten(
      this.serverless.configurationInput.provider.environment
    )
  }

  beforeWelcome() {
    this.serverless.cli.log('Hello from Serverless!')
  }

  welcomeUser() {
    this.serverless.cli.log('Your message:')
  }

  displayHelloMessage() {
    this.serverless.cli.log(`${this.options.message}`)
  }

  afterHelloWorld() {
    this.serverless.cli.log('Please come again!')
  }
}

module.exports = ServerlessEnvObj
