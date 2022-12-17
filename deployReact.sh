#!/bin/bash

while getopts k:h:s:p: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
        p) port=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" || -z "$port" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployFiles.sh -k <pem key file> -h <hostname> -s <service> -p <port>\n\n"
    exit 1
fi

hostname=$service.$hostname

printf "\n-------------------------------\nDeploying React bundle to $service to $hostname on internal port $port with $key\n-------------------------------\n"

# Step 1
printf "\n----> Build the distribution package\n"
npm run build
rm -rf dist
mkdir dist
cp -rf build dist/application
cp service/*.js dist
cp service/package* dist

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i $key ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i $key dist/* ubuntu@$hostname:services/$service

# Step 4
printf "\n----> Deploy the service on the target\n"
ssh -i $key ubuntu@$hostname << ENDSSH
cd services/${service}
npm install
if cat /etc/caddy/Caddyfile | grep -q ${hostname}; then
  printf "\n-------------------------------\nUpdating existing service\n-------------------------------\n"
  pm2 restart ${service}
elif cat /etc/caddy/Caddyfile | grep -q ${port}; then
  printf "\n-------------------------------\n            Failure             \nExisting service already using port ${port}\n-------------------------------\n"
  rm -rf ~/services/${service}
else
  printf "\n-------------------------------\nInstalling new service\n-------------------------------\n"
  pm2 start index.js --name ${service}  -- ${port}
  pm2 save
  cd ~
  sudo sh -c 'printf "\n\n${hostname} {\n\treverse_proxy * localhost:${port}\n}\n" >> Caddyfile'
  sudo service caddy restart
fi
ENDSSH

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf dist
