output "container_app_name" {
  value = azurerm_container_app.this.name
}

output "container_app_url" {
  value = "https://${azurerm_container_app.this.latest_revision_fqdn}"
}

output "container_app_principal_id" {
  value = azurerm_container_app.this.identity[0].principal_id
}