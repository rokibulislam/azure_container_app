subscription_id      = "ee73c68c-a575-4af1-9836-f306ab0751d6"
location           = "eastasia"
project_name       = "taskmgr"
environment        = "dev"

# Optional GitHub service principal / workload identity object ID
github_object_id   = ""
container_env_name      = "cae-taskmgr-dev"
container_app_name      = "ca-taskmgr-dev"
container_image         = "acrtaskmgrdev123.azurecr.io/task-manager-api:latest"
container_cpu           = 0.5
container_memory        = "1Gi"

cors_origin             = "https://sttaskmgrdevo1q8y5.z7.web.core.windows.net"
jwt_secret              = "mzTeKRqY7qYFfVUpBhieUvYbvmwH2Rd1"

sql_server_fqdn         = "sqltaskmgrdevo1q8y5.database.windows.net"
sql_database_name       = "sqldb-taskmgr-dev"
sql_admin_login         = "sqladminuser"
sql_admin_password      = "DbAdmin@94TaskX"

storage_account_name    = "sttaskmgrdevo1q8y5"
storage_account_id      = "/subscriptions/ee73c68c-a575-4af1-9836-f306ab0751d6/resourceGroups/rg-taskmgr-dev/providers/Microsoft.Storage/storageAccounts/sttaskmgrdevo1q8y5"
static_container_name   = "static"
uploads_container_name  = "uploads-private"

acr_id = "/subscriptions/ee73c68c-a575-4af1-9836-f306ab0751d6/resourceGroups/rg-taskmgr-dev/providers/Microsoft.ContainerRegistry/registries/acrtaskmgrdev123"
acr_name = "acrtaskmgrdev123"
acr_login_server = "acrtaskmgrdev123.azurecr.io"


sql_aad_admin_login     = "550919@muni.cz"
sql_aad_admin_object_id = "6aa8a30b-68a2-4d44-be30-12ffd98ef838"
sql_aad_admin_tenant_id = "11904f23-f0db-4cdc-96f7-390bd55fcee8"