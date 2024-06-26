# Getting Started

documentation for Fincra Wallet API.

# Table of Contents

- [Overview](#overview)
  - [Validations](#validations)
  - [ERD](#erd)
  - [Test Accounts](#test-accounts)
  - [URL](#url)
- [Postman Docs](#postman-docs)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Running The App](#running-the-app)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
  - [Test Cases](#test-cases)
- [API Endpoint](#API-Endpoint)
  - [Auth](#auth)
    - [Signup](#signup)
    - [Signin](#signin)
    - [Set pin](#set-pin)
    - [Change Pin](#change-pin)
  - [Transactions](#transactions)
    - [Get Transactions Histories](#get-transaction-histories)
    - [Get Transactions History](#get-transaction-history)
  - [Transfers](#transfer)
    - [Initialize](#initialize)
- [Author](#author)

# Overview

_The transfer functionality enables fund transfer between two users within the system._

## Validations

- **Wallet Pin Check:** Before initiating a transfer, the system verifies that the senders transaction pin.
- **Avoid Self-Transfer:** Transfers to the self is prohibited.
- **Insufficient Balance:** The system verifies the senders account has a balance sufficient enough to cover the transaction
- **Duplicate transaction:** Idempotency key was introduced to prevent duplicate transactions and ensure idempotent behavior.

## ERD

![picture](https://res.cloudinary.com/ajilore/image/upload/f_auto,q_auto/umjjd68uvoyjrs0wkn80)

## Test Accounts

- **User 1:**: email (raphealolams@gmail.com) Password (wemove@1) Pin (2265)
- **User 2:**: email (raphealolams++@gmail.com) Password (wemove@1)

## Url

[link](https://fincra-wallet-api-mhg6.onrender.com)

# Postman Docs

[link](https://documenter.getpostman.com/view/7484575/2sA3Qy5UgN)

# Prerequisites

you need to have the following installed on your machine

```
    node v11.3.0 or >
    postgresql 8.0.15 or >
```

# Installing

Clone the Repository

```
    git clone https://github.com/raphealolams/fincra-wallet-api
```

Install Dependency

```
    npm install
```

# Running The App

## Development Mode

```
    npm run start:dev
```

## Production Mode

```
    npm start
```

## Test Cases

```
    npm test
```

# API Endpoint

## Auth

- _Everything authentication Department_

### Signup

- _Return a newly created user._

  **URL** : `v1/auth/signup`

  **Method** : `POST`

  **Auth Required** : NO

  **Body**:

  ```json
  {
    "email": "raphealolams@gmail.com",
    "password": "wemove@1",
    "firstName": "Raphael",
    "lastName": "Ajilore",
    "phoneNumber": "2348062265208"
  }
  ```

  **Success Responses**

  **Description** : `A Object containing the newly created users data.`

  **Code** : `201 Created`

  **Content** :

  ```json
  {
    "status": true,
    "message": "Success",
    "data": {
      "email": "raphealolams@gmail.com",
      "firstName": "Raphael",
      "lastName": "Ajilore",
      "phoneNumber": "2348062265208",
      "id": "42578ee7-7638-4f4a-8ef2-73bc80a10158",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-06-04T08:51:40.849Z",
      "updatedAt": "2024-06-04T08:51:40.849Z",
      "deletedAt": null,
      "version": 1
    },
    "code": 201
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  **Code** : `400`

  **Content** :

  ```json
  {
    "code": "400",
    "message": "Invalid Phone Number",
    "data": {},
    "status": false
  }
  ```

### Signin

- _Return a department by ID._

  **URL** : `v1/auth/signin`

  **Method** : `POST`

  **Auth Required** : NO

  **Body**:

  ```json
  {
    "email": "raphealolams@gmail.com",
    "password": "wemove@1"
  }
  ```

  **Success Response**

  **Description** : `returns a authenticated user object.`

  **Code** : `200 OK`

  **Content**

  ```json
  {
    "data": {
      "id": "124fdfe8-64c3-41c0-afef-3d4febb97ace",
      "firstName": "Raphael",
      "lastName": "Ajilore",
      "phoneNumber": "2348062265209",
      "email": "raphealolams++@gmail.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-06-04T01:50:04.576Z",
      "updatedAt": "2024-06-04T01:50:04.576Z",
      "deletedAt": null,
      "version": 1,
      "wallet": {
        "id": "209868b8-f13a-4cd4-974a-490711e012b0",
        "availableBalance": 2000,
        "ledgerBalance": 2000,
        "isActive": true,
        "createdAt": "2024-06-04T01:50:04.576Z",
        "updatedAt": "2024-06-04T02:02:08.105Z",
        "deletedAt": null,
        "version": 2
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyNGZkZmU4LTY0YzMtNDFjMC1hZmVmLTNkNGZlYmI5N2FjZSIsImlhdCI6MTcxNzQ2Njk2NywiZXhwIjoxNzE3NTUzMzY3fQ.M-xUf8yHEdZXR2m_0mo2KmL9xAuOZFJE5yT6Ec053Xg",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyNGZkZmU4LTY0YzMtNDFjMC1hZmVmLTNkNGZlYmI5N2FjZSIsImlhdCI6MTcxNzQ2Njk2NywiZXhwIjoxNzMzMDE4OTY3fQ.BnWQmT17aTevEPpCJZPGccQnazl_JDxFuFs2dPZzaw4"
    },
    "status": true,
    "message": "Success",
    "code": 200
  }
  ```

  **Error Responses**

  **Description** : Return a error object.

  **Code** : `400`

  **Content** :

  ```json
  {
    "status": false,
    "message": "Invalid Username or password",
    "data": {},
    "code": 400
  }
  ```

### SetPin

- _Allows authenticated user set their wallet transaction pin_

  **URL** : `v1/auth/set-pin`

  **Method** : `PATCH`

  **Auth Required** : Yes

  **Auth Header**:

  ```json
  {
    "Authorization": "Bearer ${token}"
  }
  ```

  **Body**:

  ```json
  {
    "pin": 2265,
    "confirmPin": 2265
  }
  ```

  **Success Responses**

  **Description** : `Returns Success`

  **Code** : `200 OK`

  **Content** :

  ```json
  {
    "data": {},
    "status": true,
    "message": "Success",
    "code": 200
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  **Code** : `400`

  **Content** :

  ```json
  {
    "code": "400",
    "message": "Invalid Pin",
    "status": false,
    "data": {}
  }
  ```

### ChangePin

- _Return a category by ID._

  **URL** : `v1/auth/change-pin`

  **Method** : `PATCH`

  **Auth Required** : YES

  **Auth Header**:

  ```json
  {
    "Authorization": "Bearer ${token}"
  }
  ```

  **Body**:

  ```json
  {
    "currentPin": 1234,
    "pin": 1234,
    "confirmPin": 1234
  }
  ```

  **Success Responses**

  **Description** : `Return a object of Category`

  **Code** : `200 OK`

  **Content** :

  ```json
  {
    "data": {},
    "status": true,
    "message": "Success",
    "code": 200
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  **Code** : `400`

  **Content** :

  ```json
  {
    "code": "400",
    "message": "Invalid Pin",
    "status": false,
    "data": {}
  }
  ```

### Me

- _Return a authenticated user_

  **URL** : `v1/auth/me/`

  **Method** : `GET`

  **Auth Required** : YES

  **Auth Header**:

  ```json
  {
    "Authorization": "Bearer ${token}"
  }
  ```

  **Success Responses**

  **Description** : `Success`

  **Code** : `200 OK`

  **Content** :

  ```json
  {
    "data": {
      "id": "124fdfe8-64c3-41c0-afef-3d4febb97ace",
      "firstName": "Raphael",
      "lastName": "Ajilore",
      "phoneNumber": "2348062265209",
      "email": "raphealolams++@gmail.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-06-04T01:50:04.576Z",
      "updatedAt": "2024-06-04T01:50:04.576Z",
      "deletedAt": null,
      "version": 1,
      "wallet": {
        "id": "209868b8-f13a-4cd4-974a-490711e012b0",
        "availableBalance": 4000,
        "ledgerBalance": 4000,
        "isActive": true,
        "createdAt": "2024-06-04T01:50:04.576Z",
        "updatedAt": "2024-06-04T03:01:55.596Z",
        "deletedAt": null,
        "version": 3
      },
      "transactions": []
    },
    "status": true,
    "message": "Success",
    "code": 200
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  **Code** : `422`

  **Content** :

  ```json
  {
    "status": false,
    "message": "An unknown error occurred",
    "data": {},
    "code": 422
  }
  ```

## Transfer

- _Everything Transfer_

### Initialize Transfer

- _Return users transaction histories._

  **URL** : `v1/transfer`

  **Method** : `POST`

  **Auth Required** : YES

  **Auth Header**:

  ```json
  {
    "Authorization": "Bearer ${token}"
  }
  ```

  **Body**:

  ```json
  {
    "recipient": "124fdfe8-64c3-41c0-afef-3d4febb97ace",
    "idempotencyKey": "bc93418f-b042-4ed8-b84c-d5880b604f91",
    "amount": 500,
    "narration": "Test",
    "pin": 2261
  }
  ```

  **Success Responses**

  **Description** : `Success Response`

  **Code** : `201 Ok`

  **Content** :

  ```json
  {
    "data": {},
    "status": true,
    "message": "Success",
    "code": 201
  }
  ```

  **Error Responses**

  **Description** : `Return a error object.`

  **Code** : `400`

  **Content** :

  ```json
  {
    "status": false,
    "message": "Duplicate Transaction",
    "data": {},
    "code": 400
  }
  ```

## Transactions

- _Everything Transaction_

### Get Transaction histories

- _Return users transaction histories._

  **URL** : `v1/transactions`

  **URL Query** : `query=[string]` where `query` is the reference or transaction sessionId.

  **Method** : `GET`

  **Auth Required** : YES

  **Auth Header**:

  ```json
  {
    "Authorization": "Bearer ${token}"
  }
  ```

  **Success Responses**

  **Description** : `A paginated response of transactions.`

  **Code** : `200 Ok`

  **Content** :

  ```json
  {
    "data": {
      "data": [
        {
          "id": "f7292792-8999-4348-9875-4f46087c0251",
          "reference": "a09fcb13f4a32c5715063b4b0b761e5e",
          "narration": null,
          "type": "CR",
          "amount": 2000,
          "status": "PROCESSING",
          "balanceBeforeTransaction": 0,
          "balanceAfterTransaction": 2000,
          "sessionId": "eddd636c-25a4-4931-b9c5-d565bd376f58",
          "createdAt": "2024-06-04T02:02:08.105Z",
          "updatedAt": "2024-06-04T02:02:08.105Z",
          "deletedAt": null,
          "version": 1
        }
      ],
      "page": 1,
      "limit": 100,
      "total": 1,
      "pageCount": 1,
      "hasPreviousPage": false,
      "hasNextPage": false
    },
    "status": true,
    "message": "Success",
    "code": 200
  }
  ```

### Get Transaction history

- _Return users transaction histories._

  **URL** : `v1/transactions/id`

  **URL Parameters** : `id=[string]` where `id` is the primary key of the transaction.

  **Method** : `GET`

  **Auth Required** : YES

  **Auth Header**:

  ```json
  {
    "Authorization": "Bearer ${token}"
  }
  ```

  **Success Responses**

  **Description** : `A response of transactions.`

  **Code** : `200 Ok`

  **Content** :

  ```json
  {
    "data": {
      "id": "f7292792-8999-4348-9875-4f46087c0251",
      "reference": "a09fcb13f4a32c5715063b4b0b761e5e",
      "narration": null,
      "type": "CR",
      "amount": 2000,
      "status": "PROCESSING",
      "balanceBeforeTransaction": 0,
      "balanceAfterTransaction": 2000,
      "sessionId": "eddd636c-25a4-4931-b9c5-d565bd376f58",
      "createdAt": "2024-06-04T02:02:08.105Z",
      "updatedAt": "2024-06-04T02:02:08.105Z",
      "deletedAt": null,
      "version": 1
    },
    "status": true,
    "message": "Success",
    "code": 200
  }
  ```

# Author

- **Ajilore Raphael Olamide** - _All works_ - [github](https://github.com/raphealolams)
