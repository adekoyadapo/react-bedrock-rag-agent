import json
import random
import boto3
import os
import re
import requests
import base64

#dynamo client
dynamodb = boto3.client('dynamodb')
tableName = os.environ['tableName']

#sns client
sns = boto3.client('sns')
topicarn = os.environ['topicarn']

def check_appid_pattern(variable):
    pattern = r'^[Aa]pp\d{4,5}$'
    match = re.match(pattern, variable)
    print(f"Variable: {variable}, Match: {match}")
    return match is not None

def check_billingcode_pattern(variable):
    pattern = r'^LPX[A-Za-z0-9]{4,5}-01-01-01-[A-Za-z0-9]{4}$'
    match = re.match(pattern, variable)
    print(f"Variable: {variable}, Match: {match}")
    return match is not None

def get_named_parameter(event, name):
    return next(item for item in event['parameters'] if item['name'] == name)['value']

def get_named_property(event, name):
    return next(item for item in event['requestBody']['content']['application/json']['properties'] if item['name'] == name)['value']

def validateRequest(event):
    print("calling method: Validate Account request")
    AppID = get_named_parameter(event, 'AppID')
    BillingCode = get_named_parameter(event, 'BillingCode')

    try: 
        match_billing = check_billingcode_pattern(BillingCode)
        match_appID = check_appid_pattern(AppID)
        valid_billing = "Valid" if match_billing else "not Valid"
        valid_appID = "Valid" if match_appID else "not Valid"
    except:
        (match_billing is False and match_appID is True) or (match_appID is False and match_billing is True)
        print(f"{BillingCode} is {valid_billing} and {AppID} is {valid_appID}")
        return {
            'body': f"{BillingCode} {valid_billing} and {AppID} is {valid_appID}"
        }
    else:
        print(f"{BillingCode} is {valid_billing} and {AppID} is also {valid_appID}")
        return {
            'body': f"{BillingCode} is {valid_billing} and {AppID} is also {valid_appID}"
        }

def serviceNowRequest(event):
    print("calling method: create ServiceNow request")
    # Variables
    user = os.environ['srvnwuserName']
    password = os.environ['srvnwPasswd']
    AppID = get_named_parameter(event, 'AppID')
    AccountID = get_named_parameter(event, 'AccountID') 
    BillingCode = get_named_parameter(event, 'BillingCode') 
    RequestDetails = get_named_parameter(event, 'RequestDetails')
    email = get_named_parameter(event, 'emailAddress')
    fullName = get_named_parameter(event, 'fullName')
    # Creating Header for Authentication
    credentials = f"{user}:{password}"
    base64_credentials = base64.b64encode(credentials.encode('ascii')).decode('ascii')
    basic_auth_value = f"Basic {base64_credentials}"
    headers = {'Authorization': basic_auth_value, 'Content-Type': 'application/json'}

    requested_for = "ID-999"
    short_description = f"Ticket Created By Bob for {email} | AWS Account {AccountID} | application id {AppID}"
    description = f"""The following request is made for {fullName} - {email} AWS Account with the details

AccountID: {AccountID}
AppID: {AppID}
BillingCode: {BillingCode}

{RequestDetails}


{fullName} - {email}


    # Request Body in Json
    body_data = {
        "sysparm_quantity": "1",
        "variables": {
            "requested_for_common": requested_for,
            "ref_application_service": AppID,
            "ref_mf_application_name": short_description,
            "query_gar": description,
            "comments": f"The Application ID: {AppID} | Billing Code: {BillingCode} is validated",
            "common_applicationservice_picker": "true",
            "ref_member_firm": "",
            "contextual_search_results": "",
            "common_variable_set": "",
            "common_comments": ""
        },
        "sysparm_item_guid": "guid",
        "get_portal_messages": "true",
        "sysparm_no_validation": "true"
    }

    # Convert the object to JSON
    input_body = json.dumps(body_data)
   # Invoking ServiceNow API
    url = 'https://srv-servicenow/order_now'
    try: 
       response = requests.post(url, headers=headers, data=input_body)
       response_data = response.json()
       request_number = response_data.get('result', {}).get('request_number')
       return {
           'body': f"Created servicenow request succesfully with number {request_number}"
       }
    except requests.RequestException as e:
           print(f"An error occured: {e}")
           return None
     
def createAccountRequest(event):
    print("calling method: create Account request")
    AppID = get_named_parameter(event, 'AppID')
    AccountDescription = get_named_parameter(event, 'AccountDescription') 
    BillingCode = get_named_parameter(event, 'BillingCode') 
    
    print (event)
    
    # TODO: implement creating Account
    AccountID = str(random.randint(1, 99999))

    
    item = {
        'AccountID': {"S": AccountID},
        'AppID': {"S": AppID},
        'AccountDescription': {"S": AccountDescription},
        'BillingCode': {"S": BillingCode}
        }

    dynamodb.put_item(
        TableName=tableName,
        Item=item
        )
    
    response = sns.publish(
        TopicArn=topicarn,
        Message=f"your Account request {AppID} has been created",
        Subject="Account Request Successfully Created"
    )
    
    print(response['MessageId']) 


    return {
        'body': f"Created request {AccountID} in {tableName}"
    }
    
def lambda_handler(event, context):

    result = ''
    response_code = 200
    action_group = event['actionGroup']
    api_path = event['apiPath']
    
    print ("lambda_handler == > api_path: ",api_path)
    
    if api_path == '/createAccountRequest':
        result = createAccountRequest(event)
    elif api_path == '/validateRequest':
        result = validateRequest(event)
    elif api_path == '/serviceNowRequest':
        result = serviceNowRequest(event)
    else:
        response_code = 404
        result = f"Unrecognized api path: {action_group}::{api_path}"

    response_body = {
        'application/json': {
            'body': json.dumps(result)
        }
    }
    
    print ("Event:", event)
    action_response = {
        'actionGroup': event['actionGroup'],
        'apiPath': event['apiPath'],
        'httpMethod': event['httpMethod'], 
        'httpStatusCode': response_code,
        'responseBody': response_body
    }

    api_response = {'messageVersion': '1.0', 'response': action_response}
        
    return api_response