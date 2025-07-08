// Configuration Manager Service
// Handles environment variables and application configuration

export interface AppConfig {
  environment: string
  apiBaseUrl: string
  enableAnalytics: boolean
  enableHttps: boolean
  sessionTimeout: number
  enableLiveTesting: boolean
  enableBatchTesting: boolean
  enableSecurityScanning: boolean
  defaultRateLimitPerMinute: number
  defaultRateLimitPerHour: number
  defaultRateLimitPerDay: number
  cacheTtl: number
  enableCaching: boolean
  logLevel: string
  enableDebugLogging: boolean
}

export interface APIKeys {
  openai?: string
  anthropic?: string
  googleGemini?: string
}

class ConfigManager {
  private config: AppConfig
  private apiKeys: APIKeys

  constructor() {
    this.config = this.loadConfig()
    this.apiKeys = this.loadAPIKeys()
  }

  private loadConfig(): AppConfig {
    return {
      environment: process.env.REACT_APP_ENVIRONMENT || 'development',
      apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
      enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
      enableHttps: process.env.REACT_APP_ENABLE_HTTPS === 'true',
      sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '3600'),
      enableLiveTesting: process.env.REACT_APP_ENABLE_LIVE_TESTING !== 'false',
      enableBatchTesting: process.env.REACT_APP_ENABLE_BATCH_TESTING !== 'false',
      enableSecurityScanning: process.env.REACT_APP_ENABLE_SECURITY_SCANNING !== 'false',
      defaultRateLimitPerMinute: parseInt(process.env.REACT_APP_DEFAULT_RATE_LIMIT_PER_MINUTE || '60'),
      defaultRateLimitPerHour: parseInt(process.env.REACT_APP_DEFAULT_RATE_LIMIT_PER_HOUR || '1000'),
      defaultRateLimitPerDay: parseInt(process.env.REACT_APP_DEFAULT_RATE_LIMIT_PER_DAY || '10000'),
      cacheTtl: parseInt(process.env.REACT_APP_CACHE_TTL || '300000'),
      enableCaching: process.env.REACT_APP_ENABLE_CACHING !== 'false',
      logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
      enableDebugLogging: process.env.REACT_APP_ENABLE_DEBUG_LOGGING === 'true'
    }
  }

  private loadAPIKeys(): APIKeys {
    return {
      openai: process.env.REACT_APP_OPENAI_API_KEY,
      anthropic: process.env.REACT_APP_ANTHROPIC_API_KEY,
      googleGemini: process.env.REACT_APP_GOOGLE_GEMINI_API_KEY
    }
  }

  getConfig(): AppConfig {
    return { ...this.config }
  }

  getAPIKeys(): APIKeys {
    return { ...this.apiKeys }
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development'
  }

  isProduction(): boolean {
    return this.config.environment === 'production'
  }

  isTest(): boolean {
    return this.config.environment === 'test'
  }

  getAPIKey(provider: string): string | undefined {
    switch (provider.toLowerCase()) {
      case 'openai':
        return this.apiKeys.openai
      case 'anthropic':
        return this.apiKeys.anthropic
      case 'google-gemini':
      case 'google':
        return this.apiKeys.googleGemini
      default:
        return undefined
    }
  }

  hasAPIKey(provider: string): boolean {
    return !!this.getAPIKey(provider)
  }

  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate required configuration
    if (!this.config.apiBaseUrl) {
      errors.push('API base URL is required')
    }

    if (this.config.sessionTimeout <= 0) {
      errors.push('Session timeout must be greater than 0')
    }

    if (this.config.defaultRateLimitPerMinute <= 0) {
      errors.push('Rate limit per minute must be greater than 0')
    }

    if (this.config.defaultRateLimitPerHour <= 0) {
      errors.push('Rate limit per hour must be greater than 0')
    }

    if (this.config.defaultRateLimitPerDay <= 0) {
      errors.push('Rate limit per day must be greater than 0')
    }

    if (this.config.cacheTtl <= 0) {
      errors.push('Cache TTL must be greater than 0')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Runtime configuration updates (for testing purposes)
  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  updateAPIKeys(updates: Partial<APIKeys>): void {
    this.apiKeys = { ...this.apiKeys, ...updates }
  }

  // Feature flags
  isFeatureEnabled(feature: string): boolean {
    switch (feature) {
      case 'liveTesting':
        return this.config.enableLiveTesting
      case 'batchTesting':
        return this.config.enableBatchTesting
      case 'securityScanning':
        return this.config.enableSecurityScanning
      case 'analytics':
        return this.config.enableAnalytics
      case 'caching':
        return this.config.enableCaching
      case 'debugLogging':
        return this.config.enableDebugLogging
      default:
        return false
    }
  }

  // Logging configuration
  shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug']
    const configLevel = levels.indexOf(this.config.logLevel)
    const requestedLevel = levels.indexOf(level)
    
    return requestedLevel <= configLevel
  }

  // Security configuration
  getSecurityConfig() {
    return {
      enableHttps: this.config.enableHttps,
      sessionTimeout: this.config.sessionTimeout,
      enableSecurityScanning: this.config.enableSecurityScanning
    }
  }

  // Performance configuration
  getPerformanceConfig() {
    return {
      cacheTtl: this.config.cacheTtl,
      enableCaching: this.config.enableCaching,
      defaultRateLimitPerMinute: this.config.defaultRateLimitPerMinute,
      defaultRateLimitPerHour: this.config.defaultRateLimitPerHour,
      defaultRateLimitPerDay: this.config.defaultRateLimitPerDay
    }
  }
}

// Export singleton instance
export const configManager = new ConfigManager() 