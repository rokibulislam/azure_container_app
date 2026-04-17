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

variable "cors_origin" {
  description = "React app origin"
  type        = string
  default     = "https://sttaskmgrdevo1q8y5.z7.web.core.windows.net"
}

variable "container_image" {
  description = "Backend container image"
  type        = string
  default     = "acrtaskmgrdev123.azurecr.io/task-manager-api:latest"
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

# -----------------------------
# Container App config
# -----------------------------

variable "acr_name" {
  type = string
}

variable "acr_login_server" {
  type = string
}

variable "acr_id" {
  type = string
}

variable "container_env_name" {
  type = string
}

variable "container_app_name" {
  type = string
}

# -----------------------------
# Database (existing)
# -----------------------------

variable "sql_server_fqdn" {
  type = string
}

variable "sql_database_name" {
  type = string
}

# -----------------------------
# Storage (existing)
# -----------------------------

variable "storage_account_name" {
  type = string
}

variable "storage_account_id" {
  type = string
}

variable "static_container_name" {
  type = string
}

variable "uploads_container_name" {
  type = string
}