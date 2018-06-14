FROM node:8.6
ADD . /code
WORKDIR /code
CMD ["node", "hastur.js"]