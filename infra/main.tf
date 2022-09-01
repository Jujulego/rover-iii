terraform {
  required_version = ">= 1.2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  cloud {
    organization = "jujulego"

    workspaces {
      name = "ants"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project = "ants"
      STAGE   = var.stage
    }
  }
}
