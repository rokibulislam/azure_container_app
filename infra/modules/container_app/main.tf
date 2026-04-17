resource "azurerm_user_assigned_identity" "acr_pull" {
  name                = "uai-acr-pull-taskmgr-dev"
  resource_group_name = var.resource_group_name
  location            = var.location
}

resource "azurerm_role_assignment" "acr_pull_uai" {
  scope                = var.acr_id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.acr_pull.principal_id
}

resource "azurerm_container_app_environment" "this" {
  name                       = var.container_env_name
  location                   = var.location
  resource_group_name        = var.resource_group_name
  log_analytics_workspace_id = var.log_analytics_workspace_id
}

resource "azurerm_container_app" "this" {
  name                         = var.container_app_name
  container_app_environment_id = azurerm_container_app_environment.this.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  identity {
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.acr_pull.id]
  }

  registry {
    server   = var.acr_login_server
    identity = azurerm_user_assigned_identity.acr_pull.id
  }

  template {
    min_replicas = 0
    max_replicas = 1

    container {
      name   = "api"
      image  = var.container_image
      cpu    = var.container_cpu
      memory = var.container_memory

      env {
        name  = "PORT"
        value = "2000"
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "CORS_ORIGIN"
        value = var.cors_origin
      }

      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }

      env {
        name  = "JWT_EXPIRES_IN"
        value = "7d"
      }

      env {
        name  = "SQL_SERVER_FQDN"
        value = var.sql_server_fqdn
      }

      env {
        name  = "SQL_DATABASE_NAME"
        value = var.sql_database_name
      }

      env {
        name  = "SQL_PORT"
        value = "1433"
      }

      env {
        name  = "SQL_USE_MANAGED_IDENTITY"
        value = "false"
      }

      env {
        name  = "SQL_USER"
        value = var.sql_admin_login
      }

      env {
        name  = "SQL_PASSWORD"
        value = var.sql_admin_password
      }

      env {
        name  = "STORAGE_ACCOUNT_NAME"
        value = var.storage_account_name
      }

      env {
        name  = "STATIC_CONTAINER_NAME"
        value = var.static_container_name
      }

      env {
        name  = "UPLOADS_CONTAINER_NAME"
        value = var.uploads_container_name
      }

      env {
        name  = "STORAGE_USE_MANAGED_IDENTITY"
        value = "true"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 2000
    transport        = "auto"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull_uai
  ]
}

resource "azurerm_role_assignment" "storage_blob_data_contributor" {
  scope                = var.storage_account_id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_container_app.this.identity[0].principal_id
}