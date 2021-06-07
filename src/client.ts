import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  DeleteRetentionPolicyCommand,
  DescribeLogGroupsCommand,
  LogGroup,
  PutRetentionPolicyCommand
} from "@aws-sdk/client-cloudwatch-logs";


export class LogGroupNotFound extends Error {
  constructor(m: string) {
    super(m);

    (<any>Object).setPrototypeOf(this, LogGroupNotFound.prototype);
  }
}


export class LogsClient {
  client: CloudWatchLogsClient;

  constructor() {
    this.client = new CloudWatchLogsClient({});

    this.getLogGroup = this.getLogGroup.bind(this);
  }

  async getLogGroup(name: string): Promise<LogGroup> {
    // TODO: Figure out what to do if paged and no match
    const data = await this.client.send(new DescribeLogGroupsCommand({
      logGroupNamePrefix: name
    }))

    let found = false;
    if (data.logGroups) {
      for (let logGroup of data.logGroups) {
        if (logGroup.logGroupName === name) {
          found = true;
          return logGroup;
        }
      }
    }

    throw new LogGroupNotFound('LogGroup named "' + name + '" was not found')
  }

  async createLogGroup(name: string): Promise<boolean> {
    try {
      await this.getLogGroup(name)
      return false
    } catch (err) {
      if (err instanceof LogGroupNotFound) {
        await this.client.send(new CreateLogGroupCommand({
          logGroupName: name
        }))
        return true
      } else {
        throw err;
      }
    }
  }

  async putRetentionPolicy(logGroup: string, retentionInDays: number): Promise<void> {
    await this.client.send(new PutRetentionPolicyCommand({
      logGroupName: logGroup,
      retentionInDays: retentionInDays
    }))
  }

  async deleteRetentionPolicy(logGroup: string): Promise<void> {
    await this.client.send(new DeleteRetentionPolicyCommand({
      logGroupName: logGroup
    }))
  }
}
