export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export function getEnvironment(nodeEnv: string): Environment {
  if (nodeEnv === Environment.PRODUCTION) {
    return Environment.PRODUCTION
  }
  return Environment.DEVELOPMENT
}
