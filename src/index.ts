import Serverless from 'serverless'
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
  hooks: { [key: string]: Thunk }

  constructor(private serverless: Serverless & ProviderEnvironment) {
    this.hooks = {
      initialize: this.transformEnv.bind(this),
    }
  }

  transformEnv() {
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
}

module.exports = ServerlessEnvObj
