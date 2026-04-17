variable "sql_server_name" {
  type = string
}

variable "sql_database_name" {
  type = string
}

variable "location" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "sql_admin_login" {
  type = string
}

variable "sql_admin_password" {
  type      = string
  sensitive = true
}

variable "sql_db_min_capacity" {
  type = number
}

variable "sql_db_max_size_gb" {
  type = number
}

variable "sql_db_auto_pause_delay_minutes" {
  type = number
}