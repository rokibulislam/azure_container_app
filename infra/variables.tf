variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "westeurope"
}

variable "project_name" {
  description = "Short project name prefix"
  type        = string
  default     = "taskmgr"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "sql_admin_login" {
  description = "Azure SQL admin username"
  type        = string
  default     = "sqladminuser"
}

variable "sql_admin_password" {
  description = "Azure SQL admin password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for the API"
  type        = string
  sensitive   = true
}

variable "container_cpu" {
  description = "CPU for container app"
  type        = number
  default     = 0.5
}

variable "container_memory" {
  description = "Memory for container app"
  type        = string
  default     = "1Gi"
}

variable "sql_db_min_capacity" {
  description = "Azure SQL serverless minimum vCores"
  type        = number
  default     = 0.5
}

variable "sql_db_max_size_gb" {
  description = "Azure SQL max storage in GB"
  type        = number
  default     = 2
}

variable "sql_db_auto_pause_delay_minutes" {
  description = "Auto-pause delay for serverless SQL"
  type        = number
  default     = 60
}

variable "github_object_id" {
  description = "Optional service principal object ID"
  type        = string
  default     = ""
}

variable "sql_aad_admin_login" {
  description = "Azure AD admin login for SQL server"
  type        = string
}

variable "sql_aad_admin_object_id" {
  description = "Azure AD admin object ID for SQL server"
  type        = string
}

variable "sql_aad_admin_tenant_id" {
  description = "Azure AD tenant ID for SQL server"
  type        = string
}

