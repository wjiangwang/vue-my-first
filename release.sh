version=$1
docker build -t enterprise/front:${version} .
docker tag enterprise/front:${version} 47.105.232.176/staging-front-enterprise/enterprise/front:${version}
docker push 47.105.232.176/staging-front-enterprise/enterprise/front:${version}
# npm run build staging
