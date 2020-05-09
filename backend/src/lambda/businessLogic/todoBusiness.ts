import * as AWS from 'aws-sdk';
import { TodoItem } from '../../models/TodoItem';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { v4 as uuidv4 } from 'uuid';
import { TodoAccess } from '../dataLayer/todoAccess';
import { TodoUpdate } from '../../models/TodoUpdate';

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

    const newTodo: TodoItem = {
      userId: userId,
      todoId,
      ...parsedBody,
      done: false,
      createdAt: new Date().toISOString(),
      attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${todoId}`,
    };

    return await this.todoAccess.createTodo(newTodo);
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    await this.todoAccess.deleteTodo(todoId, userId);
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    return await this.todoAccess.getTodos(userId);
  }

  async updateTodo(
    todoId: string,
    userId: string,
    updatedTodo: TodoUpdate,
  ): Promise<TodoUpdate> {
    return this.todoAccess.updateTodo(todoId, userId, updatedTodo);
  }
}
