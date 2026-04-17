output "storage_account_id" {
  description = "Storage account ID"
  value       = azurerm_storage_account.this.id
}

output "storage_account_name" {
  description = "Storage account name"
  value       = azurerm_storage_account.this.name
}

output "primary_blob_endpoint" {
  description = "Primary blob endpoint"
  value       = azurerm_storage_account.this.primary_blob_endpoint
}

output "static_website_url" {
  description = "Static website endpoint"
  value       = azurerm_storage_account.this.primary_web_endpoint
}

output "static_container_name" {
  description = "Public static files container name"
  value       = azurerm_storage_container.static.name
}

output "uploads_container_name" {
  description = "Private uploads container name"
  value       = azurerm_storage_container.uploads_private.name
}