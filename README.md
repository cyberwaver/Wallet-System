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

## Application Endpoints

| METHOD | PATH                                  | DESCRIPTION            | SAMPLE RESULT                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------ | ------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/users` [Optional pagination params] | Gets the list of users | `{ "status": "success", "message": "User created successfully", "data": [ { "id": "pnA1XxhrABkTy4h1DUhEpA", "cId": 2, "firstName": "Hope", "lastName": "Praise", "email": "hope@g.com", "createdAt": "2021-08-09T08:48:46.650Z", "updatedAt": null, "deletedAt": null }, { "id": "pS9WBq3AZGk4fbFBNYmshU", "cId": 1, "firstName": "Hope", "lastName": "Praise", "email": "hope1@g.com", "createdAt": "2021-08-09T08:48:40.524Z", "updatedAt": null, "deletedAt": null } ] }` |
| POST   | `/users`                              | Creates a new user     | `{ "status": "success", "message": "User created successfully", "data": { "firstName": "Hope", "lastName": "Praise", "email": "hope@g.com", "id": "pnA1XxhrABkTy4h1DUhEpA", "cId": 2, "createdAt": "2021-08-09T08:48:46.650Z", "updatedAt": null, "deletedAt": null } }`                                                                                                                                                                                                     |
|        |                                       |                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|        |                                       |                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|        |                                       |                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

```python
import foobar

# returns 'words'
foobar.pluralize('word')

# returns 'geese'
foobar.pluralize('goose')

# returns 'phenomenon'
foobar.singularize('phenomena')
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
