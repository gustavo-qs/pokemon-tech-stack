output "process_message_queue_url" {
  value = aws_sqs_queue.process_message_queue.url
}

output "message_processed_queue_url" {
  value = aws_sqs_queue.message_processed_queue.url
}
