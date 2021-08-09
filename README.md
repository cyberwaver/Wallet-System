# MMG Take Home Test

1. A Simple wallet application, users can create wallets, wallet types, topup wallets and also send money between wallets.
2. The app should also provide endpoints for triggering state-lga file (already given) import to the application and also to view it in a certain format.

## Local Setup

Clone this repo

```bash
git clone https://github.com/cyberwaver/mmg-test.git
```

Install dependencies

```bash
yarn
```

Run PostgreSQL database migration. [(View Knex Doc)](http://knexjs.org/)

```bash
npx knex --knexfile ./config/database/knex.config.js migrate:latest
```

Start server

```bash
yarn dev
```

Test

```bash
yarn test:usecases
```

_With more time: I would have written complete usecases test, nevertheless, the tests written covered the core parts._

## Application Endpoints

pagination params: `{page: number, pageSize: number (default: 20)}`

| METHOD | PATH                                  | DESCRIPTION                                                                                                       | SAMPLE RESULT                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------ | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/users` [Optional pagination params] | Gets the list of users                                                                                            | `{ "status": "success", "message": "User created successfully", "data": [ { "id": "pnA1XxhrABkTy4h1DUhEpA", "cId": 2, "firstName": "Hope", "lastName": "Praise", "email": "hope@g.com", "createdAt": "2021-08-09T08:48:46.650Z", "updatedAt": null, "deletedAt": null }, { "id": "pS9WBq3AZGk4fbFBNYmshU", "cId": 1, "firstName": "Hope", "lastName": "Praise", "email": "hope1@g.com", "createdAt": "2021-08-09T08:48:40.524Z", "updatedAt": null, "deletedAt": null } ] }` |
| POST   | `/users`                              | Creates a new user <br/> `input: {firstName: string:required, lastName: string:required, email: string:required}` | `{ "status": "success", "message": "User created successfully", "data": { "firstName": "Hope", "lastName": "Praise", "email": "hope@g.com", "id": "pnA1XxhrABkTy4h1DUhEpA", "cId": 2, "createdAt": "2021-08-09T08:48:46.650Z", "updatedAt": null, "deletedAt": null } }`                                                                                                                                                                                                     |
| GET    | `/users/:id`                          | Gets user with id including wallets and transactions                                                              | `{ "status": "success", "data": { "id": "pnA1XxhrABkTy4h1DUhEpA", "cId": 2, "firstName": "Hope", "lastName": "Praise", "email": "hope@g.com", "createdAt": "2021-08-09T08:48:46.650Z", "updatedAt": null, "deletedAt": null, "wallets": [], "transactions": [] } }`                                                                                                                                                                                                          |

|GET | `/wallets/types` | Gets wallet types [Optional pagination params] | `{ "status": "success", "data": [ { "id": "3VFyJjFXt7oKq4MsrJQbgt", "cId": 2, "name": "type2", "minBalance": 5000, "createdAt": "2021-08-09T09:16:50.594Z", "updatedAt": null, "deletedAt": null }, { "id": "sKu5EZ5nkVd4SjCkbX8CmR", "cId": 1, "name": "type1", "minBalance": 2000, "createdAt": "2021-08-09T09:16:31.143Z", "updatedAt": null, "deletedAt": null } ] }`
|

| POST | `/wallets/types` <br/> `input: {name: string:required, minBalance: number,required}` | Adds a new wallet type | `{ "status": "success", "message": "Wallet type added successfully", "data": { "name": "type2", "minBalance": 5000, "id": "3VFyJjFXt7oKq4MsrJQbgt", "cId": 2, "createdAt": "2021-08-09T09:16:50.594Z", "updatedAt": null, "deletedAt": null } }` |

| GET | `/wallets/types/:id` | Gets wallet type with id | `{ "status": "success", "data": { "id": "3VFyJjFXt7oKq4MsrJQbgt", "cId": 2, "name": "type2", "minBalance": 5000, "createdAt": "2021-08-09T09:16:50.594Z", "updatedAt": null, "deletedAt": null } }` |

|GET | `/wallets` | Gets wallet [Optional pagination params] | `{ "status": "success", "data": [ { "id": "i2G5bxsuAYRQWTJwjPXCir", "cId": 2, "typeId": "3VFyJjFXt7oKq4MsrJQbgt", "ownerId": "vFKZo9A14ucLX69t3TD7Rs", "balance": 0, "createdAt": "2021-08-09T09:31:27.043Z", "updatedAt": null, "deletedAt": null }, { "id": "cP8q1V1vrtoNGrqbCgYSGy", "cId": 1, "typeId": "3VFyJjFXt7oKq4MsrJQbgt", "ownerId": "4T9nFPPrfgQhoVFZPfsRDi", "balance": 0, "createdAt": "2021-08-09T09:30:22.850Z", "updatedAt": null, "deletedAt": null } ] }` |

| POST | `/wallets` | Creates a new wallet <br/> `input: {ownerId: string:required, typeId: string:required}` | `{ "status": "success", "message": "Wallet created successfully", "data": { "typeId": "3VFyJjFXt7oKq4MsrJQbgt", "ownerId": "4T9nFPPrfgQhoVFZPfsRDi", "id": "cP8q1V1vrtoNGrqbCgYSGy", "cId": 1, "balance": 0, "createdAt": "2021-08-09T09:30:22.850Z", "updatedAt": null, "deletedAt": null } }` |

| GET | `/wallets/:id` | Gets wallet with id including owner, type and transactions | `{ "status": "success", "data": { "id": "i2G5bxsuAYRQWTJwjPXCir", "cId": 2, "typeId": "3VFyJjFXt7oKq4MsrJQbgt", "ownerId": "vFKZo9A14ucLX69t3TD7Rs", "balance": 0, "createdAt": "2021-08-09T09:31:27.043Z", "updatedAt": null, "deletedAt": null, "owner": { "id": "vFKZo9A14ucLX69t3TD7Rs", "cId": 3, "firstName": "Hope", "lastName": "Praise", "email": "hope2@g.com", "createdAt": "2021-08-09T09:02:50.417Z", "updatedAt": null, "deletedAt": null }, "type": { "id": "3VFyJjFXt7oKq4MsrJQbgt", "cId": 2, "name": "type2", "minBalance": 5000, "createdAt": "2021-08-09T09:16:50.594Z", "updatedAt": null, "deletedAt": null }, "transactions": [] } }` |

| POST | `/wallets/topup` | Creates a new wallet topup transaction <br/> `input: {toWalletId: string:required, amount: number,required}` | `{ "status": "success", "message": "Wallet topup transaction created successfully", "data": { "toWalletId": "i2G5bxsuAYRQWTJwjPXCir", "amount": 10000, "type": "TOPUP", "id": "qFB56FTZUcBdMZ98YrTMbW", "cId": 1, "fromWalletId": null, "status": "PENDING", "comment": null, "processedAt": null, "createdAt": "2021-08-09T09:39:48.289Z", "updatedAt": null, "deletedAt": null } }` |

| POST | `/wallets/transfer` | Creates a new wallet transfer transaction <br/> `input: {fromWalletId: string:required, toWalletId: string:required, amount: number,required}` | `{ "status": "success", "message": "Wallet transfer transaction created successfully", "data": { "fromWalletId": "i2G5bxsuAYRQWTJwjPXCir", "toWalletId": "cP8q1V1vrtoNGrqbCgYSGy", "amount": 5000, "type": "TRANSFER", "id": "9gEYKWuMyShYUur4H6VSCu", "cId": 2, "status": "PENDING", "comment": null, "processedAt": null, "createdAt": "2021-08-09T09:46:55.162Z", "updatedAt": null, "deletedAt": null } }` |

|GET | `/misc/stats` | Gets Application Statistics | `{ "status": "success", "data": { "userCount": 4, "walletCount": 2, "walletTypeCount": 2, "walletBalanceTotal": 10000, "txnVolumeTotal": 15000 } }` |

|GET | `/misc/state-lga/view` | Gets recently imported state_lga.xlsx file | `{ "status": "success", "data": { "FCT": [ "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali" ], "Aba": [ "Aba North", "Aba South", "Umuahia North", "Umuahia South" ], "Akwa Ibom": [ "Eket", "Uyo", "Calabar Municipality" ], "Anambra": [ "Awka North", "Awka South", "Nnewi", "Onitsha" ], "Delta": [ "Asaba", "Ughelli", "Warri", "Abakaliki", "Oredo" ], "Ondo": [ "Ado", "Ikare", "Akure North", "Akure South", "Ondo East", "Ondo West" ], "Enugu": [ "Enugu East", "Enugu North", "Enugu South", "Nsukka" ], "Imo": [ "Owerri Municipal", "Owerri North", "Owerri South" ], "Kwara": [ "Ilorin East", "Ilorin West", "Offa" ], "Lagos": [ "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju/Lekki", "Ifako-Ijaye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere" ], "Ogun": [ "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko-Afon", "Ipokia", "Obafemi-Owode", "Ogun Waterside", "Odeda", "Odogbolu", "Remo North", "Shagamu" ], "Osun": [ "Owo", "Osogbo", "Ile-ife", "Ilesha", "Ede" ], "Oyo": [ "Ibadan Central", "Ibadan North", "Ibadan North West", "Ibadan South East", "Ibadan South West", "Lagelu Ogbomosho North", "Ogbmosho South", "Oyo East", "Oyo West" ], "Rivers": [ "Eleme", "Port Harcourt" ] } }` |

| POST | `/misc/state-lga/import` | Triggers import of provided `state_lga.xlsx` file | `{ "status": "success", "message": "State LGA Excel sheet imported successfully" }` |

## Tools Used

- Nodejs - scripting language (javascript) used for the backend.
- ExpressJS - server framework used for handling requests and responses
- PostgreSQL - SQL database
- ObjectionJS - ORM that uses knex under the hood for easy interaction with the database
- Awilix - A Dependency Injection(DI) Container library for node, makes IoC (Inversion of Control) easy.
- Queue - An in-app queue library, used for handling race condition concurrency problem in event handling.
- Convert-excel-to-json - Libray used for converting xlsx file format to json.
- EventEmitter2 - For establishing asynchronous communication via events.
- JOI - For input validation
- Morgan - For logging
  ... etc.

## Note

![Clean Architecture Image](/assets/clean-architecture-1.jpeg)

![Clean Architecture Image](/assets/clean-architecture-2.jpeg)

The architecture design for this application is based on inspiration from the clean architecture by Robert C. Martin (Uncle Bob)

The design enforces loose-coupling amount components.

Based on the onion architecture which can be traced back to the layering approach of network computers OSI model.

#### OVERVIEW

- External requests (http, grpc etc) comes in to the app via the interfaces
- An appropriate controller handles the request by forwarding the request to the appropriate usecase handler
- The Usecase handler validates the data, makes some checks based on some set of rules, fetches data via repository handlers
- The controller gets back the response, forwards it to the client.

...There is a clear mental model on how the application works, implementations aren't tied to controllers.
