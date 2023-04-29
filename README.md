# Money Transfer App 

This is a small money transfer app where users can 
1. Sign up and log in.
2. Generate a unique bank account that can accept deposits via bank transfer.
3. Receive notification for bank transfers using webhooks.
4. Send money to other banks.
This service is powered by [Raven atlas API](https://raven-atlas.readme.io/reference).

This web service was built using NodeJS, Express, Knex and MySQL.

## Endpoints documentation
Click [here](https://documenter.getpostman.com/view/8761686/2s93eSZFPL) to access the link to the Postman collection documentation of all the endpoints

## Running this service
- Clone the repository
```
git clone https://github.com/awesome-urch/money-transfer-app.git <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```

- Configure your MySQL server and edit the .env file <br>
Here is the [E-R Diagram](https://dbdesigner.page.link/6V7oxKmQPq2o2ZB18)

- Build and run the project
```
npm run build
npm start
```
