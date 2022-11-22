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
    printf "  syntax: deploy.sh -k <pem key file> -h <hostname> -s <service> -p <port>\n\n"
    exit 1
fi

printf "\n-------------------------------\nDeploying $service to $hostname on internal port $port with $key\n-------------------------------\n"

# Build the distribution package
rm -rf dist
mkdir dist
cp -r application dist
cp *.js dist
cp package* dist

# Clear out the previous distribution on the target.
ssh -i $key ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Copy the distribution package to the target.
scp -r -i $key dist/* ubuntu@$hostname:services/$service

# Deploy the service on the target. A new service is registered if it doesn't exist.
ssh -i $key ubuntu@$hostname << ENDSSH
cd services/${service}
npm install
if cat /etc/caddy/Caddyfile | grep -q ${service}; then
  printf "\n-------------------------------\nUpdating existing service\n-------------------------------\n"
  pm2 restart ${service}
elif cat /etc/caddy/Caddyfile | grep -q ${port}; then
  printf "\n-------------------------------\n            Failure             \nExisting service already using port ${port}\n-------------------------------\n"
  rm -rf ~/services/${service}
else
  printf "\n-------------------------------\nInstalling new service\n-------------------------------\n"
  pm2 start index.js --name ${service}
  pm2 save
  cd ~
  sudo sed -i '/file_server/a \\\n\treverse_proxy /${service}* localhost:${port}' /etc/caddy/Caddyfile
  sudo service caddy restart
fi

ENDSSH

# Delete the local copy of the package.
rm -rf dist