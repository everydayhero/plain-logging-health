resource "terraform_remote_state" "remote_state" {
  backend = "s3"
  config {
    bucket = "edh-terraform-state"
    key    = "plain-logging-health-${var.environment_name}"
    region = "us-east-1"

    access_key = "${var.state_access_key}"
    secret_key = "${var.state_secret_key}"
  }
}
