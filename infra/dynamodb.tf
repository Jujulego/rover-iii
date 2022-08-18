resource "aws_dynamodb_table" "maps-table" {
  name           = "maps"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "mapId"

  attribute {
    name = "mapId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "tiles-table" {
  name           = "tiles"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "blockId"
  range_key      = "blockPosition"

  attribute {
    name = "blockId"
    type = "S"
  }

  attribute {
    name = "blockPosition"
    type = "S"
  }
}
