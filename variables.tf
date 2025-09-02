variable "application_name" {
  description = "Name of the Azure AD application"
  type        = string
  default     = "ms-callback-app"
}

variable "redirect_uri" {
  description = "Redirect URI for OAuth callback"
  type        = string
  default     = "http://localhost:3000/callback"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "owners" {
  description = "List of object IDs of application owners"
  type        = list(string)
  default     = []
}

variable "additional_redirect_uris" {
  description = "Additional redirect URIs beyond the default"
  type        = list(string)
  default     = []
}
