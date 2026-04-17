resource "azurerm_mssql_server" "this" {
  name                          = var.sql_server_name
  resource_group_name           = var.resource_group_name
  location                      = var.location
  version                       = "12.0"
  administrator_login           = var.sql_admin_login
  administrator_login_password  = var.sql_admin_password
  minimum_tls_version           = "1.2"
  public_network_access_enabled = true
}

resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.this.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_mssql_database" "this" {
  name                         = var.sql_database_name
  server_id                    = azurerm_mssql_server.this.id
  sku_name                     = "GP_S_Gen5_1"
  max_size_gb                  = var.sql_db_max_size_gb
  min_capacity                 = var.sql_db_min_capacity
  auto_pause_delay_in_minutes  = var.sql_db_auto_pause_delay_minutes

  lifecycle {
    prevent_destroy = false
  }
}


resource "azurerm_mssql_firewall_rule" "my_ip" {
  name             = "AllowMyIP"
  server_id        = azurerm_mssql_server.this.id
  start_ip_address = "89.24.50.253"
  end_ip_address   = "89.24.50.253"
}