resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

locals {
  prefix               = "${var.project_name}-${var.environment}"
  resource_group_name  = "rg-${local.prefix}"
  log_analytics_name   = "law-${local.prefix}"
  container_env_name   = "cae-${local.prefix}"
  container_app_name   = "ca-${local.prefix}"
  acr_name             = substr(replace("acr${var.project_name}${var.environment}${random_string.suffix.result}", "-", ""), 0, 50)
  sql_server_name      = substr(replace("sql-${local.prefix}-${random_string.suffix.result}", "-", ""), 0, 60)
  sql_database_name    = "sqldb-${local.prefix}"
  storage_account_name = substr(replace("st${var.project_name}${var.environment}${random_string.suffix.result}", "-", ""), 0, 24)
}

module "resource_group" {
  source   = "./modules/resource_group"
  name     = local.resource_group_name
  location = var.location
}

module "monitoring" {
  source              = "./modules/monitoring"
  name                = local.log_analytics_name
  location            = module.resource_group.location
  resource_group_name = module.resource_group.name
}

module "storage" {
  source               = "./modules/storage"
  storage_account_name = local.storage_account_name
  location             = module.resource_group.location
  resource_group_name  = module.resource_group.name
}

module "database" {
  source                          = "./modules/database"
  sql_server_name                 = local.sql_server_name
  sql_database_name               = local.sql_database_name
  location                        = module.resource_group.location
  resource_group_name             = module.resource_group.name
  sql_admin_login                 = var.sql_admin_login
  sql_admin_password              = var.sql_admin_password
  sql_db_max_size_gb              = var.sql_db_max_size_gb
  sql_db_min_capacity             = var.sql_db_min_capacity
  sql_db_auto_pause_delay_minutes = var.sql_db_auto_pause_delay_minutes
}

module "container_app" {
  source = "./modules/container_app"

  resource_group_name        = module.resource_group.name
  location                   = module.resource_group.location
  container_env_name         = var.container_env_name
  log_analytics_workspace_id = module.monitoring.log_analytics_workspace_id

  container_app_name         = var.container_app_name
  container_image            = var.container_image
  container_cpu              = var.container_cpu
  container_memory           = var.container_memory

  cors_origin                = var.cors_origin
  jwt_secret                 = var.jwt_secret

  sql_server_fqdn            = var.sql_server_fqdn
  sql_database_name          = var.sql_database_name
  sql_admin_login            = var.sql_admin_login
  sql_admin_password         = var.sql_admin_password

  storage_account_name       = var.storage_account_name
  storage_account_id         = var.storage_account_id
  static_container_name      = var.static_container_name
  uploads_container_name     = var.uploads_container_name

  acr_login_server           = var.acr_login_server
  acr_id                     = var.acr_id
}