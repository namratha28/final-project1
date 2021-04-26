# DevOps Final Project
The project at hand is to develop a Bus Booking Web App that allows users to register, login and make bookings. The users will be booked with the best available operator for the selected dates. 
The user can also delete the booking if they wish to.

## Introduction
The source code contains code for backend with Python, frontend with React, the k8s deployment YAMLs and Terraform scripts to provision resources on AWS.

## Steps to run
- Open a cmd window and type ```git clone https://github.com/namratha28/final-project1```
- CD to terraform folder and type ```terraform init``` ```terraform plan``` ```terraform apply```
- CD to kube-manifests, and open cmd and type ```kubectl apply -f uber-be.yaml``` ```kubectl apply -f uber-fe.yaml``` ```kubectl create -f service-be.yaml``` and ```kubectl create -f service-fe.yaml```'
- Next, type in ```kubectl get svc``` and navigate to the load balancer URL to find the app running.
