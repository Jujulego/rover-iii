data "aws_iam_user" "github-actions" {
  user_name = "ants-github-actions"
}

data "aws_iam_policy_document" "github-actions" {
  statement {
    actions   = ["s3:PutObject", "s3:PutObjectAcl"]
    effect    = "Allow"
    resources = ["${aws_s3_bucket.frontend.arn}/*"]
  }

  statement {
    actions   = ["s3:ListBucket"]
    effect    = "Allow"
    resources = [aws_s3_bucket.frontend.arn]
  }
}

resource "aws_iam_policy" "github-actions" {
  name        = "ants-github-actions-policy"
  path        = "/"
  description = "Github Action Policy"
  policy      = data.aws_iam_policy_document.github-actions.json
}

resource "aws_iam_policy_attachment" "github-actions" {
  name       = "ants-github-actions-attachment"
  policy_arn = aws_iam_policy.github-actions.arn
  users = [data.aws_iam_user.github-actions.user_name]
}
