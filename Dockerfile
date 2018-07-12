FROM node:8.5
ADD . /code
WORKDIR /code
CMD ["node", "app.js"]