export enum EventType {
  TASK_CREATED = "task_created",
  TASK_DELETED = "task_deleted",
  USER_REGISTERED = "user_registered",
  SYSTEM_ALERT = "system_alert"
}

export enum EventPriority {
  HIGH = "high",
  LOW = "low"
}

export enum DeliveryMethod {
  EMAIL = "email",
  SMS = "sms",
  IN_APP = "in-app"
}