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
        "ec2:*"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:ec2:*:*:*"
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
    handler = "handlers.health"
}

resource "aws_lambda_permission" "plain_logging_health_scheduled" {
    statement_id = "plain_logging_health_scheduled"
    action = "lambda:InvokeFunction"
    function_name = "${aws_lambda_function.plain_logging_health.arn}"
    principal = "events.amazonaws.com"
    source_arn = "${aws_cloudwatch_event_rule.logging_health_event.arn}"
}

output "lambda_execution_role_arn" {
  value = "${aws_iam_role.plain_logging_health_lambda_execution_role.arn}"
}
