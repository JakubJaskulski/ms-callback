variable "redirect_uri" {
  description = "Redirect URI for OAuth callback"
  type        = string
  default     = "http://localhost:3000/callback"
}

variable "owners" {
  description = "List of object IDs of application owners"
  type        = list(string)
  default     = []
}
