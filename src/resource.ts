import { LogsClient } from './client';
import response from 'cfn-response'
import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';

const cloudwatchlogs = new LogsClient();

export const handler = (event: CloudFormationCustomResourceEvent, context: Context) => {
  console.log('Received event:\n', JSON.stringify(event, null, 2));

  const logGroup: string = event.ResourceProperties.LogGroup;
  const retentionInDays: number = parseInt(event.ResourceProperties.RetentionInDays.toString(), 10);

  try {
    if (logGroup) {
      let request: Promise<any>;

      switch (event.RequestType) {
        case 'Create':
        case 'Update':
          if (retentionInDays) {
            request = cloudwatchlogs.createLogGroup(logGroup)
              .then(() => {
                return cloudwatchlogs.putRetentionPolicy(logGroup, retentionInDays)
              });
          } else {
            throw new Error('RetentionInDays not specified');
          }
          break;
        case 'Delete':
          request = cloudwatchlogs.deleteRetentionPolicy(logGroup);
          break;
        default:
          throw new Error('The unknown request type is not supported.');
      }

      request.then(() => {
        response.send(event, context, response.SUCCESS, {}, logGroup)
      }).catch((err) => {
        response.send(event, context, response.FAILED, {}, logGroup)
      });
    } else {
      throw new Error('LogGroup not specified');
    }
  } catch (err: any) {
    response.send(event, context, response.FAILED, {}, logGroup)
  }
}
