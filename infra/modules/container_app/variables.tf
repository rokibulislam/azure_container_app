variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "container_env_name" {
  type = string
}

variable "log_analytics_workspace_id" {
  type = string
}

variable "container_app_name" {
  type = string
}

variable "container_image" {
  type = string
}

variable "container_cpu" {
  type    = number
  default = 0.5
}

variable "container_memory" {
  type    = string
  default = "1Gi"
}

variable "cors_origin" {
  type = string
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "sql_server_fqdn" {
  type = string
}

variable "sql_database_name" {
  type = string
}

variable "sql_admin_login" {
  type = string
}

variable "sql_admin_password" {
  type      = string
  sensitive = true
}

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

variable "acr_login_server" {
  type = string
}

variable "acr_id" {
  type = string
}