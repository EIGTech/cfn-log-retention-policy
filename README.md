# CFN-LogRetentionPolicy

##### Topics

- [Syntax](#syntax)
- [Permissions](#permissions)
- [Properties](#properties)
- [Return Values](#return-values)
- [Examples](#examples)
- [More Info](#more-info)

### Syntax

To declare this entity in your AWS CloudFormation template, use the following syntax:

##### JSON

<big><pre>
{
&nbsp;&nbsp;&nbsp;&nbsp;"Type" : "Custom::LogRetentionPolicy",
&nbsp;&nbsp;&nbsp;&nbsp;"Properties" : {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Version": "1.0",
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"[ServiceToken](#servicetoken)": String,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"[LogGroup](#loggroup)": String,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"[RetentionInDays](#retentionindays)": Integer
&nbsp;&nbsp;&nbsp;&nbsp;}
}
</big></pre>

##### YAML

<big><pre>
Type: Custom::LogRetentionPolicy
Properties:
&nbsp;&nbsp;&nbsp;&nbsp;Version: '1.0'
&nbsp;&nbsp;&nbsp;&nbsp;[ServiceToken](#servicetoken): String
&nbsp;&nbsp;&nbsp;&nbsp;[LogGroup](#loggroup): String
&nbsp;&nbsp;&nbsp;&nbsp;[RetentionInDays](#retentionindays): Integer</pre></big>

### Permissions

##### `logs:DescribeLogGroups`

The resource handler searches existing log groups to ensure it exists before it can set a retention policy.

_Resource access_: all CloudWatch Logs ARNs

_Lifecycle events_: `Create`, `Update`

##### `logs:CreateLogGroup`

> ###### Note
>
> This permission is only required if you are setting retention policies for log groups that do not already exist.

The resource handler needs an existing log group to apply a retention policy. It creates one if it doesn't exist.

_Resource access_: The ARN for the log group specified in the [LogGroup](#loggroup) property.

_Lifecycle events_: `Create`, `Update` _Only if the group doesn't exist_

##### `logs:PutRetentionPolicy`

This is the primary purpose of this resource. It is required for the resource to work.

_Resource access_: The ARN for the log group specified in the [LogGroup](#loggroup) property.

_Lifecycle events_: `Create`, `Update`

##### `logs:DeleteRetentionPolicy`

This permission is required when removing the resource.

_Resource access_: The ARN for the log group specified in the [LogGroup](#loggroup) property.

_Lifecycle events_: `Delete`

### Properties

###### ServiceToken

The service token is the ARN to the Lambda function for the custom resource. It is exported for convenience as the function name with an optional prefix configured in the template.

_Required_: Yes

_Type_: String

_Update requires_: Updates are not supported.

###### LogGroup

The name of the log group. Creates a new log group if one does not already exist.

> ##### Note
>
> Changing the name requires replacement and will not delete the old log group.
> Use the [`AWS::Logs::LogGroup`](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html) instead if you are in need of managing log groups.

_Required_: Yes

_Type_: String

_Update requires_: [Replacement][lifecycle:replacement]

###### RetentionInDays

The number of days log events are kept in CloudWatch Logs. When a log event expires, CloudWatch Logs automatically deletes it. For valid values, see [PutRetentionPolicy](http://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutRetentionPolicy.html) in the _Amazon CloudWatch Logs API Reference_.

_Required_: Yes

_Type_: Integer

_Update requires_: [No Interruption][lifecycle:no-interruption]

### Return Values

##### Ref

When the logical ID of this resource is provided to the `Ref` intrinsic function, `Ref` returns the resource name.

For more information about using the `Ref` function, see [Ref](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html).

### Examples

The following example sets a CloudWatch Logs retention policy for a lambda function that retains events for 7 days.

```json
{
  "MyFunctionRetentionPolicy": {
    "Type": "Custom::LogRetentionPolicy",
    "Properties": {
      "Version": "1.0",
      "ServiceToken": { "Fn::ImportValue": "CFN-LogRetentionPolicy" },
      "LogGroup": { "Fn::Sub": "/aws/lambda/${MyFunction}" },
      "RetentionInDays": 7
    }
  }
}
```

```yaml
MyFunctionRetentionPolicy:
  Type: Custom::LogRetentionPolicy
  Properties:
    Version: "1.0"
    ServiceToken: !ImportValue "CFN-LogRetentionPolicy"
    LogGroup: !Sub "/aws/lambda/${MyFunction}"
    RetentionInDays: 7
```

### More Info

- For more about custom resources see the [AWS::CloudFormation::CustomResource](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html) documentation.

- See the [CloudWatch Logs API Reference](http://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/Welcome.html) for more information on CloudWatch Logs.

- In many cases the official [`AWS::Logs::LogGroup`](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html) may be sufficient.

[launch-stack]: https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=CFN-LogRetentionPolicy&templateURL=https://s3.amazonaws.com/fancyguy-devops/cloudformation/templates/log-retention-policy.yml
[launch-image]: https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png
[lifecycle:replacement]: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement
[lifecycle:no-interruption]: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt
