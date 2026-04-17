output "resource_group_name" {
  value = module.resource_group.name
}

output "container_app_name" {
  value = module.container_app.container_app_name
}

output "container_app_url" {
  value = module.container_app.container_app_url
}


output "sql_server_fqdn" {
  value = module.database.sql_server_fqdn
}

output "sql_database_name" {
  value = module.database.sql_database_name
}

output "storage_account_name" {
  value = module.storage.storage_account_name
}

output "static_website_url" {
  value = module.storage.static_website_url
}

output "static_container_name" {
  value = module.storage.static_container_name
}

output "uploads_container_name" {
  value = module.storage.uploads_container_name
}

output "container_app_principal_id" {
  value = module.container_app.container_app_principal_id
}
