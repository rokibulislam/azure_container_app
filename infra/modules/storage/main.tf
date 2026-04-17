locals {
  static_container_name  = "static"
  uploads_container_name = "uploads-private"
}

resource "azurerm_storage_account" "this" {
  name                            = var.storage_account_name
  resource_group_name             = var.resource_group_name
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = true

  blob_properties {
    versioning_enabled = true
  }
}

resource "azurerm_storage_account_static_website" "this" {
  storage_account_id = azurerm_storage_account.this.id
  index_document     = "index.html"
  error_404_document = "index.html"
}

resource "azurerm_storage_container" "static" {
  name                  = local.static_container_name
  storage_account_id    = azurerm_storage_account.this.id
  container_access_type = "blob"
}

resource "azurerm_storage_container" "uploads_private" {
  name                  = local.uploads_container_name
  storage_account_id    = azurerm_storage_account.this.id
  container_access_type = "private"
}