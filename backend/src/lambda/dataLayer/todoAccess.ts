import { TodoItem } from '../../models/TodoItem';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { TodoUpdate } from '../../models/TodoUpdate';

export class TodoAccess {
  private readonly docClient: DocumentClient;
  private readonly todosTable: string;
  private readonly indexName: string;

  constructor(docClient: DocumentClient) {
    this.docClient = docClient;
    this.todosTable = process.env.TODOS_TABLE;
    this.indexName = process.env.INDEX_NAME;
  }

  async createTodo(newTodo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({ TableName: this.todosTable, Item: newTodo })
      .promise();

    return newTodo;
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    await this.docClient
      .delete({ TableName: this.todosTable, Key: { todoId, userId } })
      .promise();
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .scan({
        TableName: this.todosTable,
        IndexName: this.indexName,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
      .promise();

    return result.Items as TodoItem[];
  }

  async updateTodo(
    todoId: string,
    userId: string,
    updatedTodo: TodoUpdate,
  ): Promise<TodoUpdate> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId,
        },
        UpdateExpression: 'set dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':dueDate': updatedTodo.dueDate,
          ':done': updatedTodo.done,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();

    return updatedTodo;
  }
}
