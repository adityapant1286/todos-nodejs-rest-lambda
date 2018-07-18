# todos-nodejs-rest-lambda
A simple 'todo' project built using Node JS, REST API, AWS Lambda using serverless framework

Prerequisites:
- Node JS
- AWS Free tier account
- Your favorite code editor/IDE (Recommendation - Visual Studio Code)

### Setup serverless framework on your computer
After you install Node JS in your computer, you need to install 'serverless' framework. 

Open *terminal* in Linux/Mac or *Command Prompt/Powershell* in Windows and enter following command.

> *npm install serverless -g*

Create IAM user in AWS Console (in your or close to your region) and **download 'credentials.csv' file.**
Then add *AdministratorAccess* permissions to this user.

Setup Serverless profile with this IAM user by entering following command. Replace square brackets with information in credentials.csv
> *serverless config credentials --provider aws --key [user-access-key] --secret [secret-access-key] --profile [user-name]*

**Example:** serverless config credentials --provider aws --key ~~ABC123~~ --secret ~~XYZ456~~ --profile ~~serverless-admin~~

This project is aws-nodejs template ready, therefore only installation is sufficient.
(You can create your own project using serverless framework, please refer [serverless framework](https://serverless.com/) for more details.)

### Setup project

Clone the Git repo and navigate to directory in *terminal/command prompt* where **serverless.yml** is present.

Open **serverless.yml** file in editor, then replace `region` and `profile` values under `provider` section. Optionally you could also experiment with other configurations.
```
provider:
  region: [your-aws-region]
  profile: [your-aws-IAM-user]
```


Run following command to deploy NodeJS-Lambda functions to your AWS console
> *sls deploy -v*

Serverless framework will create all required configurations in your AWS account then deploy Lambda functions as well as REST API gateway endpoints.

Copy these endpoint URLS from *terminal/command prompt* and use them to test Lambda functions. You could write your own REST API client in your favorite language `JavaScript, Java, Angular, ReactJS, Python, Ruby etc.` or directly test on AWS Lambda console or download *Advanced REST Client* or *Postman* (Google chrome extensions) to test these APIs as it is.

### Additional useful serverless commands
If you modify any function and just want to deploy this modified function.
> *sls deploy function -f [function-name]*

If you want to invoke function
> *sls invoke -f [function-name] -l*

If you want to fetch logs of a function
> *sls logs -f [function-name]*

Remove/undeploy all Lambda functions and relating configurations (only for a service, please refer `service` section in serverless.yml)
> *sls remove*

**Note:** This will not remove DynamoDB tables created during the first deployment, you can manually remove these tables from AWS console. Otherwise `sls deploy -v` will show you create_errors for these tables as they are already present.
