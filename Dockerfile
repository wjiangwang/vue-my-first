FROM nginx
COPY ./dist/enterprise /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html
