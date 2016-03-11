# AWS Credentials
# --------------------------------------------------------------------------------
variable "access_key" {}
variable "secret_key" {}

variable "state_access_key" {}
variable "state_secret_key" {}

variable "environment_name" {
  default = "staging"
}

variable "region" {
  default = "us-east-1"
}
