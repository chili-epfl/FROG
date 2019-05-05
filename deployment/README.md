# Deployment

##  A. Creating Cluster

We use kubernetes on Hetzner Cloud for deployment of all the componenets of the system.
This guide describes how we create the cluster. 

For setup, this guide https://github.com/hobby-kube/guide has been used. For automation of this guide check https://github.com/hobby-kube/provisioning. Please note that not every step described in this guide will be installed. The provisioning does the following.
    
    1. provisioning N nodes from Hetzner (1 master, N-1 worker, you must stick to one type of node, but after installation you may upgrade or downgrade specific nodes using Hetzner cloud console)
    2. Setting up Wiregroud to create a private network between nodes
    3. Configuring firewall rules using `ufw` for all nodes
    4. Setting up etcd for all nodes
    5. Installing kubeadm, kubelet, kubectl
    6. Installing kubernetes master using kubeadm in the first node, the rest of nodes joins to the master

You can follow all these steps in main.tf file. Please also check hcloud specific configuration parameters in variables.tf file.

The following describes what needs to be done to make cluster setup work for Hetzner. 

0. clone the repository: https://github.com/hobby-kube/provisioning

1. requirements: 
    
    `brew install terraform kubectl jq wireguard-tools`

2. Comment out unrelated module definitions in main.tf. Basically, modules called provider for hetzner, swap, wireguard, firewall, etcd and kubernetes should run. 

3. Please check all the variables in the format of ${var.VARIABLE_NAME} in the main.tf. Those are defined in variable.tf, configure them accordingly.

4. Last but not least, you should replace master configuration file with the one placed in this repository. 
    `service/kubernetes/templates/master-configuration.yml`

       # fetch the required modules
       $ terraform init

       # see what `terraform apply` will do
       $ terraform plan

       # execute it
       $ terraform apply

After the setup, run `kubectl get nodes -o wide` just to see nodes are included in kubernetes cluster. Internal IP addresses in the output should be in the format of 10.0.1.x which are defined in Wireguard setup. This let nodes to communicate with each other through the private network. 
If you are interested in kubernetes architecture and its internal componenets, you can check this article https://medium.com/jorgeacetozi/kubernetes-master-components-etcd-api-server-controller-manager-and-scheduler-3a0179fc8186.


### Adding additional nodes into the cluster
    # TODO

## B. Deployment

We maintain a docker image of FROG. You can find Dockerfile in root directory of this project. Currently, it's published on dockerhub you can find it under the repo of  arasmumcuyan/frog:test.
There are many manifest files defined in kubernetes directory . The components of the system are the following. 
    
0. Installing Helm

Before deploying pods into the cluster. We need to install helm in the cluster to be able to use helm charts. Helm charts are basically package manager of kubernetes. To deploy an application (let's say mongo database), many resources needs to be define (serviceAccount, service, deployment etc.), helm charts make this process easier by letting us configuring one values.yaml file. We will use helm for everything except frog application deployment. To install helm (client side) and tiller (at server side). 

       # for macOS
       $ brew install kubernetes-helm

       # create service account for tiller with cluster-admin role
       $ kubectl apply -f helm/rbac-tiller.yaml
    
       # deploy tiller pod into the cluster
       $ helm init --service-account tiller --history-max 200
    
Many open source projects provide helm chart for easy deployment. The development https://github.com/helm/charts/tree/master/stable. All of the charts that we use for FROG deployment are present in this directory and include default values.yaml file. We overwrite some of the configurations and pass the file as a command line argument with the option (-f).

1. Deployment of redis

    `helm install --namespace default --name frog-redis -f redis-helm-values.yaml stable/redis`

2. Deployment of mongodb (mongo-helm-values.yaml)

    `helm install --name frog-db stable/mongodb -f mongo-helm-values.yaml`

3. Deploymnet of FROG application (frog-app-deployment.yaml)

    `kubectl apply -f frog-app-deployment.yaml`

4. Deployment of FROG dashboard application (frog-dash-deployment.yaml)

    `kubectl apply -f frog-dash-deployment.yaml`

5. Deployment of nginx (frog-nginx-helm-values.yaml)

    `helm install --name frog-ingress --namespace ingress -f frog-nginx-helm-values.yaml stable/nginx-ingress`

6. Deployment sminio

    `helm install --namespace default --name frog-minio -f minio-helm-values.yaml stable/minio`


helm install --name frog-db stable/mongodb -f mongo-helm-values.yaml

## C. Monitoring

helm install --namespace monitor --name prom -f prometheus-helm-values.yaml stable/prometheus-operator


I've used following tutorial
https://sysdig.com/blog/kubernetes-monitoring-prometheus-operator-part3/



## Security
- https://vadosware.io/post/securing-your-kubernetes-cluster/

## Resource Management for Pods
https://medium.com/hotels-com-technology/kubernetes-container-resource-requirements-part-1-memory-a9fbe02c8a5f