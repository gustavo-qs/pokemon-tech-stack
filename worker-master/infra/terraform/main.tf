resource "aws_sqs_queue" "process_message_queue" {
  name = "process-message"

  # Configurações opcionais da fila
  delay_seconds              = 0
  max_message_size           = 262144
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 0
  visibility_timeout_seconds = 30
}

resource "aws_sqs_queue" "message_processed_queue" {
  name = "message-processed"

  # Configurações opcionais da fila
  delay_seconds              = 0
  max_message_size           = 262144
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 0
  visibility_timeout_seconds = 30
}
