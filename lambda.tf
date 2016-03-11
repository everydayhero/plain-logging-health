resource "aws_iam_role" "plain_logging_health_lambda_execution_role" {
    name = "plain_logging_health_lambda_execution_role"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "plain_logging_health_lambda_policy" {
    name = "plain_logging_health_lambda_policy"
    role = "${aws_iam_role.plain_logging_health_lambda_execution_role.id}"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Action": [
        "sns:publish"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:sns:*:*:*",
    },
    {
      "Action": [
        "sns:publish"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:es:*:*:*",
    }
  ]
}
EOF
}


resource "aws_lambda_function" "plain_logging_health" {
    filename = "./release.zip"
    function_name = "plain_logging_health"
    role = "${aws_iam_role.plain_logging_health_lambda_execution_role.arn}"
    timeout = "30"
    handler = "handlers.receive"
    provisioner "local-exec" {
      command = "AWS_ACCESS_KEY_ID=${var.access_key} AWS_SECRET_ACCESS_KEY=${var.secret_key} aws lambda add-permission --function-name plain_logging_health --statement-id api-gateway-invoke --action lambda:invokeFunction --principal apigateway.amazonaws.com --region us-east-1 --source-arn ${var.api_messages_post_arn}"
    }
}

output "lambda_execution_role_arn" {
  value = "${aws_iam_role.plain_logging_health_lambda_execution_role.arn}"
}
