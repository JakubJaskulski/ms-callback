terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.47"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.0"
}

provider "azurerm" {
  features {}
}

provider "azuread" {
}

data "azuread_client_config" "current" {}

resource "azuread_application" "ms_callback_app" {
  display_name     = "ms-callback-app"
  owners = [data.azuread_client_config.current.object_id]
  sign_in_audience = "AzureADMyOrg"

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000"
    resource_access {
      id   = "a65f2972-a4f8-4f5e-afd7-69ccb046d5dc"
      type = "Scope"
    }
  }

  web {
    redirect_uris = ["http://localhost:3000/callback"]

    implicit_grant {
      access_token_issuance_enabled = false
      id_token_issuance_enabled     = true
    }
  }

  api {
    mapped_claims_enabled          = false
    requested_access_token_version = 2
  }

  tags = ["terraform", "ms-callback"]
}

resource "azuread_service_principal" "ms_callback_sp" {
  application_id               = azuread_application.ms_callback_app.application_id
  app_role_assignment_required = false
  owners = [data.azuread_client_config.current.object_id]

  tags = ["terraform", "ms-callback"]
}

resource "azuread_application_password" "ms_callback_secret" {
  application_object_id = azuread_application.ms_callback_app.object_id
  display_name          = "ms-callback-secret"
  end_date_relative     = "8760h"
}

data "azuread_service_principal" "microsoft_graph" {
  application_id = "00000003-0000-0000-c000-000000000000"
}
