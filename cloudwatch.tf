resource "aws_cloudwatch_event_rule" "logging_health_event" {
  name = "logging_health_event"
  description = "Run scheduled event for logging health lambda"
  schedule_expression = "rate(60 minutes)"
}

resource "aws_cloudwatch_event_target" "cloudwatch_logging_health_lambda" {
  rule = "${aws_cloudwatch_event_rule.logging_health_event.name}"
  target_id = "InvokeLogginHealthLambda"
  arn = "${aws_lambda_function.plain_logging_health.arn}"
}

output "cloudwatch_event_rule_arn" {
  value = "${aws_cloudwatch_event_rule.logging_health_event.arn}"
}
