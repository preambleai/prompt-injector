/**
 * Activity Logger Service
 * Centralized logging for user activities and system events
 */

export interface ActivityEvent {
  id: string
  action: string
  timestamp: string
  type: 'test' | 'payload' | 'model' | 'settings' | 'session' | 'system'
  details?: Record<string, any>
  vulnerability?: boolean
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  model?: string
  payload?: string
  user?: string
  icon?: string
}

export class ActivityLogger {
  private static instance: ActivityLogger
  private readonly STORAGE_KEY = 'recentActivity'
  private readonly MAX_ACTIVITIES = 100

  private constructor() {}

  public static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger()
    }
    return ActivityLogger.instance
  }

  /**
   * Log a new activity event
   */
  public logActivity(activity: Omit<ActivityEvent, 'id' | 'timestamp'>): void {
    const event: ActivityEvent = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...activity
    }

    const activities = this.getActivities()
    activities.unshift(event)

    // Keep only the most recent activities
    if (activities.length > this.MAX_ACTIVITIES) {
      activities.splice(this.MAX_ACTIVITIES)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities))
  }

  /**
   * Get all activities
   */
  public getActivities(): ActivityEvent[] {
    try {
      const activities = localStorage.getItem(this.STORAGE_KEY)
      return activities ? JSON.parse(activities) : []
    } catch (error) {
      console.error('Failed to load activities:', error)
      return []
    }
  }

  /**
   * Get recent activities (last n activities)
   */
  public getRecentActivities(limit: number = 5): ActivityEvent[] {
    return this.getActivities().slice(0, limit)
  }

  /**
   * Clear all activities
   */
  public clearActivities(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * Log test execution
   */
  public logTestExecution(modelName: string, payloadName: string, vulnerability: boolean, severity?: string): void {
    this.logActivity({
      action: `Test executed: ${modelName} - ${payloadName}`,
      type: 'test',
      vulnerability,
      severity: severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      model: modelName,
      payload: payloadName,
      icon: 'play-circle',
      details: {
        testType: 'security_test',
        result: vulnerability ? 'vulnerable' : 'secure'
      }
    })
  }

  /**
   * Log payload creation
   */
  public logPayloadCreation(payloadName: string, category: string): void {
    this.logActivity({
      action: `Created payload: ${payloadName}`,
      type: 'payload',
      payload: payloadName,
      icon: 'plus-circle',
      details: {
        category,
        operation: 'create'
      }
    })
  }

  /**
   * Log payload modification
   */
  public logPayloadModification(payloadName: string, category: string): void {
    this.logActivity({
      action: `Modified payload: ${payloadName}`,
      type: 'payload',
      payload: payloadName,
      icon: 'edit',
      details: {
        category,
        operation: 'modify'
      }
    })
  }

  /**
   * Log model configuration
   */
  public logModelConfiguration(modelName: string, provider: string, enabled: boolean): void {
    this.logActivity({
      action: `${enabled ? 'Enabled' : 'Disabled'} model: ${modelName}`,
      type: 'model',
      model: modelName,
      icon: enabled ? 'check-circle' : 'x-circle',
      details: {
        provider,
        enabled,
        operation: 'configure'
      }
    })
  }

  /**
   * Log settings changes
   */
  public logSettingsChange(setting: string, value: any): void {
    this.logActivity({
      action: `Updated setting: ${setting}`,
      type: 'settings',
      icon: 'settings',
      details: {
        setting,
        value,
        operation: 'update'
      }
    })
  }

  /**
   * Log session start
   */
  public logSessionStart(sessionName: string, testCount: number): void {
    this.logActivity({
      action: `Started test session: ${sessionName}`,
      type: 'session',
      icon: 'play',
      details: {
        sessionName,
        testCount,
        operation: 'start'
      }
    })
  }

  /**
   * Log session completion
   */
  public logSessionComplete(sessionName: string, results: { total: number, vulnerabilities: number }): void {
    this.logActivity({
      action: `Completed test session: ${sessionName}`,
      type: 'session',
      icon: 'check',
      details: {
        sessionName,
        totalTests: results.total,
        vulnerabilities: results.vulnerabilities,
        operation: 'complete'
      }
    })
  }

  /**
   * Log system events
   */
  public logSystemEvent(event: string, details?: Record<string, any>): void {
    this.logActivity({
      action: event,
      type: 'system',
      icon: 'info',
      details
    })
  }

  /**
   * Format timestamp for display
   */
  public formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      
      return date.toLocaleDateString()
    } catch (error) {
      return timestamp
    }
  }

  /**
   * Seed initial activities for demonstration (used if no activities exist)
   */
  public seedInitialActivities(): void {
    const existingActivities = this.getActivities()
    if (existingActivities.length > 0) {
      return // Don't seed if activities already exist
    }

    // Create sample activities with different timestamps
    const sampleActivities = [
      {
        action: 'Platform initialized',
        type: 'system' as const,
        icon: 'info',
        details: { operation: 'startup' }
      },
      {
        action: 'Welcome to AI Security Testing Platform',
        type: 'system' as const,
        icon: 'info',
        details: { operation: 'welcome' }
      }
    ]

    // Add each sample activity with a slight delay to create different timestamps
    sampleActivities.forEach((activity, index) => {
      setTimeout(() => {
        this.logActivity(activity)
      }, index * 100)
         })
   }
}

// Export singleton instance
export const activityLogger = ActivityLogger.getInstance() 