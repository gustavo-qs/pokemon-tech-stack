import { Message } from '@/core/entities/message';

describe(Message.name, () => {
  test('should create a message instance with id and message', () => {
    const id = '123';
    const messageText = 'Hello, World!';

    const message = new Message(id, messageText);

    expect(message).toBeInstanceOf(Message);
    expect(message.id).toBe(id);
    expect(message.message).toBe(messageText);
  });
});
