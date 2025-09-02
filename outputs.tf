# Output the important values for use in your application
output "application_id" {
  description = "The Application (Client) ID of the Azure AD app"
  value       = azuread_application.ms_callback_app.application_id
  sensitive   = false
}

output "object_id" {
  description = "The Object ID of the Azure AD app"
  value       = azuread_application.ms_callback_app.object_id
  sensitive   = false
}

output "client_secret" {
  description = "The client secret for the Azure AD app"
  value       = azuread_application_password.ms_callback_secret.value
  sensitive   = true
}

output "tenant_id" {
  description = "The Azure AD tenant ID"
  value       = data.azuread_client_config.current.tenant_id
  sensitive   = false
}

output "redirect_uri" {
  description = "The configured redirect URI"
  value       = "http://localhost:3000/callback"
  sensitive   = false
}

output "auth_url" {
  description = "The OAuth 2.0 authorization endpoint"
  value       = "https://login.microsoftonline.com/${data.azuread_client_config.current.tenant_id}/oauth2/v2.0/authorize"
  sensitive   = false
}

output "token_url" {
  description = "The OAuth 2.0 token endpoint"
  value       = "https://login.microsoftonline.com/${data.azuread_client_config.current.tenant_id}/oauth2/v2.0/token"
  sensitive   = false
}
