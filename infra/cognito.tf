resource "aws_cognito_user_pool" "ants-user-pool" {
  name = "ants-user-pool-${var.stage}"

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  username_configuration {
    case_sensitive = false
  }
}

resource "aws_cognito_user_pool_client" "ants-frontend" {
  name          = "ants-frontend-${var.stage}"
  user_pool_id  = aws_cognito_user_pool.ants-user-pool.id
  callback_urls = ["http://localhost:4000/ants/", var.frontend-url]
  logout_urls   = ["http://localhost:4000/ants/", var.frontend-url]

  generate_secret              = false
  explicit_auth_flows          = ["ALLOW_REFRESH_TOKEN_AUTH"]
  supported_identity_providers = ["COGNITO"]

  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
}

resource "aws_cognito_user_pool_domain" "ants" {
  domain       = "ants-${var.stage}"
  user_pool_id = aws_cognito_user_pool.ants-user-pool.id
}

resource "aws_cognito_identity_pool" "ants-identity-pool" {
  identity_pool_name               = "ants-identity-pool-${var.stage}"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id     = aws_cognito_user_pool_client.ants-frontend.id
    provider_name = aws_cognito_user_pool.ants-user-pool.endpoint
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "ants-identity-pool" {
  identity_pool_id = aws_cognito_identity_pool.ants-identity-pool.id

  roles = {
    "authenticated" = aws_iam_role.ants-authorized-user.arn
  }
}
