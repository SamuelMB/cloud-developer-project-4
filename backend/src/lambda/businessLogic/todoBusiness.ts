import * as AWS from 'aws-sdk';
import { TodoItem } from '../../models/TodoItem';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { v4 as uuidv4 } from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { TodoUpdate } from '../../models/TodoUpdate';
import { createLogger } from '../../utils/logger';

const logger = createLogger('fileBusiness');

export class TodoBusiness {
  private readonly docClient: AWS.DynamoDB.DocumentClient;
  private readonly todoAccess: TodoAccess;
  private readonly bucketName: string;

  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.todoAccess = new TodoAccess(this.docClient);
    this.bucketName = process.env.IMAGES_S3_BUCKET;
  }

  async createTodo(
    userId: string,
    parsedBody: CreateTodoRequest,
  ): Promise<TodoItem> {
    const todoId = uuidv4();

    logger.info(`Creating New Todo`);

    const newTodo: TodoItem = {
      userId: userId,
      todoId,
      ...parsedBody,
      done: false,
      createdAt: new Date().toISOString(),
      attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${todoId}`,
    };

    const todoCreated = await this.todoAccess.createTodo(newTodo);

    logger.info(`Todo Created: ${todoCreated}`);

    return todoCreated;
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    logger.info('Deleting Todo');
    await this.todoAccess.deleteTodo(todoId, userId);
    logger.info(`Todo Deleted: ${todoId}`);
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Recovering Todos');
    const todos = await this.todoAccess.getTodos(userId);
    logger.info(`Todos Recovered: ${todos}`);
    return todos;
  }

  async updateTodo(
    todoId: string,
    userId: string,
    updatedTodo: TodoUpdate,
  ): Promise<TodoUpdate> {
    logger.info('Updating Todo');
    const todoUpdated = this.todoAccess.updateTodo(todoId, userId, updatedTodo);
    logger.info(`Updated Todo: ${todoUpdated}`);
    return todoUpdated;
  }
}
