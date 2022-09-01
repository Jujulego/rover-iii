resource "aws_ssm_parameter" "ants-client-id" {
  name  = "/ants/${var.stage}/client-id"
  type  = "String"
  value = aws_cognito_user_pool_client.ants-frontend.id
}

resource "aws_ssm_parameter" "ants-user-pool-id" {
  name  = "/ants/${var.stage}/user-pool-id"
  type  = "String"
  value = aws_cognito_user_pool.ants-user-pool.id
}
