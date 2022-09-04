output "AuthDomain" {
  value = "${aws_cognito_user_pool_domain.ants.domain}.auth.${var.region}.amazoncognito.com"
}

output "AuthIdentityPoolId" {
  value = aws_cognito_identity_pool.ants-identity-pool.id
}

output "AuthUserPoolId" {
  value = aws_cognito_user_pool.ants-user-pool.id
}

output "AuthClientId" {
  value = aws_cognito_user_pool_client.ants-frontend.id
}
