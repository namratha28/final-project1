# DevOps Final Project
The project at hand is to develop a Bus Booking Web App that allows users to register, login and make bookings. The users will be booked with the best available operator for the selected dates. 
The user can also delete the booking if they wish to.

## Introduction
The source code contains code for backend with Python, frontend with React, the k8s deployment YAMLs and Terraform scripts to provision resources on AWS.

## Steps to run
- Open a cmd window and type git clone https://github.com/namratha28/final-project1
- CD to terraform folder and type ```terraform init``` ```terraform plan``` ```terraform apply```
- Verify the VPC and EKS cluster on AWS console.
### ECR Steps
- Create ECR repositories for backend and frontend on AWS console and make note of the URLs of the repo.
- Tag Immutability: Enable
- Scan On Push: Enable
- Click on Create Repository
- Make a note of Repository name
### Create CodePipeline
- Create CodePipeline
- Go to Services -> CodePipeline -> Create Pipeline
- Pipeline Settings
- Pipeline Name: eks-devops-pipe
- Service Role: New Service Role (leave to defaults)
- Role Name: Auto-populated
- Rest all leave to defaults and click Next
- Source
- Source Provider: GitHub
- Repository Name: your repo name
- Branch Name: master
- Change Detection Options: GitHub web hooks
- Build
- Build Provider: AWS CodeBuild
- Region: us-west-2
- Project Name: Click on Create Project
- Create Build Project
- Project Configuration
- Project Name: eks-devops-cb-for-pipe
- Description: CodeBuild Project for EKS DevOps Pipeline
- Environment
- Environment Image: Managed Image
- Operating System: Amazon Linux 2
- Runtimes: Standard
- Image: aws/codebuild/amazonlinux2-x86_64-standard:3.0
- Image Version: Always use the latest version for this runtime
- Environment Type: Linux
- Privileged: Enable
- Role Name: Auto-populated
- Additional Configurations
- All leave to defaults except Environment Variables
- Add Environment Variables
- REPOSITORY_URI = 180789647333.dkr.ecr.us-east-1.amazonaws.com/eks-devops-nginx
- EKS_KUBECTL_ROLE_ARN: arn:aws:iam::<<<your acc ID>>>:role/EksCodeBuildKubectlRole
- EKS_CLUSTER_NAME = your cluster name
- AWS_ACCOUNT_ID: your acc ID
- username - Dockerhub uname
- password - Dockerhub pwd
- Buildspec
- leave to defaults
- Logs
- Group Name: eks-deveops-cb-pipe
- Stream Name:
- Click on Continue to CodePipeline
- We should see a message Successfully created eks-devops-cb-for-pipe in CodeBuild.
- Click Next
- Deploy
- Click on Skip Deploy Stage
- Review
- Review and click on Create Pipeline

### IAM Role to allow CodeBuild to talk to EKS
- In an AWS CodePipeline, we are going to use AWS CodeBuild to deploy changes to our Kubernetes manifests.
- This requires an AWS IAM role capable of interacting with the EKS cluster.
- In this step, we are going to create an IAM role and add an inline policy EKS:Describe that we will use in the CodeBuild stage to interact with the EKS cluster via kubectl.
```# Export your Account ID
export ACCOUNT_ID=<<<your acc ID>>>

# Set Trust Policy
TRUST="{ \"Version\": \"2012-10-17\", \"Statement\": [ { \"Effect\": \"Allow\", \"Principal\": { \"AWS\": \"arn:aws:iam::${ACCOUNT_ID}:root\" }, \"Action\": \"sts:AssumeRole\" } ] }"

# Verify inside Trust policy, your account id got replacd
echo $TRUST

# Create IAM Role for CodeBuild to Interact with EKS
aws iam create-role --role-name EksCodeBuildKubectlRole --assume-role-policy-document "$TRUST" --output text --query 'Role.Arn'

# Define Inline Policy with eks Describe permission in a file iam-eks-describe-policy
echo '{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Action": "eks:Describe*", "Resource": "*" } ] }' > /tmp/iam-eks-describe-policy

# Associate Inline Policy to our newly created IAM Role
aws iam put-role-policy --role-name EksCodeBuildKubectlRole --policy-name eks-describe --policy-document file:///tmp/iam-eks-describe-policy

# Verify the same on Management Console```
```
### aws_auth_config_map steps
- Add the arn for the role created in the configmap file. 
- Once the EKS aws-auth ConfigMap includes this new role, kubectl in the CodeBuild stage of the pipeline will be able to interact with the EKS cluster via the IAM role.

### Updae CodeBuild Role to have access to ECR full access
- First pipeline run will fail as CodeBuild not able to upload or push newly created Docker Image to ECR Repostory
-Update the CodeBuild Role to have access to ECR to upload images built by codeBuild.
-Role Name: codebuild-eks-devops-cb-for-pipe-service-role
-Policy Name: AmazonEC2ContainerRegistryFullAccess
-Verify CodeBuild Logs
-New image should be uploaded to ECR, verify the ECR with new docker image tag date time.
-Build will fail again at Post build stage at STS Assume role section. Lets fix that in next step.

###  Update CodeBuild Role to have access to STS Assume Role we have created using STS Assume Role Policy
- Build should be failed due to CodeBuild dont have access to perform updates in EKS Cluster.
-It even cannot assume the STS Assume role whatever we created.
-Create STS Assume Policy and Associate that to CodeBuild Role codebuild-eks-devops-cb-for-pipe-service-role.

#### Create STS Assume Role Policy
- Go to Services IAM -> Policies -> Create Policy
- In Visual Editor Tab
- Service: STS
- Actions: Under Write - Select AssumeRole
- Resources: Specific
- Add ARN
- Specify ARN for Role: arn:aws:iam::180789647333:role/EksCodeBuildKubectlRole
- Click Add
- For Role ARN, replace your account id here, refer step-07 environment variable EKS_KUBECTL_ROLE_ARN for more details
- arn:aws:iam::<your-account-id>:role/EksCodeBuildKubectlRole
- Click on Review Policy
- Name: eks-codebuild-sts-assume-role
- Description: CodeBuild to interact with EKS cluster to perform changes
- Click on Create Policy
- Associate Policy to CodeBuild Role
- Role Name: codebuild-eks-devops-cb-for-pipe-service-role
- Policy to be associated: eks-codebuild-sts-assume-role

### Final Implementation
- Once the kube-manifest is applied, open cmd and type ```kubectl get svc``` to obtain the backend loadbalancer URL.
- Copy the backend URL and go to github and navigate to uber-frontend and open AccessApiCalls.js and BookingsApiCalls.js.
- Here, modify the url variable and paste the previously copied backend url and commit the change.
- After the successful build, do a ```kubectl get svc``` and navigate to the frontend loadbalancer URL to view the application. 
  



 
