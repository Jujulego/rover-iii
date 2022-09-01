data "aws_iam_policy_document" "ants-authorized-assume-role" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    principals {
      type        = "Federated"
      identifiers = ["cognito-identity.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRoleWithWebIdentity"
    ]

    condition {
      test     = "StringEquals"
      variable = "cognito-identity.amazonaws.com:aud"
      values   = [aws_cognito_identity_pool.ants-identity-pool.id]
    }

    condition {
      test     = "ForAnyValue:StringLike"
      variable = "cognito-identity.amazonaws.com:amr"
      values   = ["authenticated"]
    }
  }
}

data "aws_iam_policy_document" "ants-authorized" {
  version = "2012-10-17"

  statement {
    effect = "Allow"

    actions = [
      "mobileanalytics:PutEvents",
      "cognito-sync:*",
      "cognito-identity:*",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role" "ants-authorized-user" {
  name               = "ants-authorized-user-${var.stage}"
  assume_role_policy = data.aws_iam_policy_document.ants-authorized-assume-role.json

  inline_policy {
    name   = "ants-authorized-${var.stage}"
    policy = data.aws_iam_policy_document.ants-authorized.json
  }
}
