variable "region" {
  type        = string
  default     = "eu-west-3"
  description = "AWS region to deploy to"
}

variable "stage" {
  type        = string
  default     = "dev"
  description = "Ressource group"
}

variable "frontend-url" {
  type        = string
  default     = "https://jujulego.github.io/ants/"
  description = "URL where the frontend is hosted"
}
