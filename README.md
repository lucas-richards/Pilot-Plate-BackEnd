# Hackathon API

This is the backend for the full stack Hackathon App

## Technologies Used

- MongoDB
- Express.js
- Node.js


## Planning section


### ERD

<img src="./images/erd.png" alt="entity relationship diagram">


## API

Scripts are included in [`curl-scripts`](curl-scripts) to test built-in actions. Feel free to use Postman for testing, using the curl scripts listed below and in the folder for setting up headers and request bodies.
Add your own scripts to test your custom API.

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

### places

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET   | `/places`             | `places#index`    |
| GET   | `/places/<place_id>`    | `places#show`    |
| POST   | `/places`             | `places#create`    |
| PATCH  | `/places/<place_id>` | `places#update`  |
| DELETE | `/places/<place_id>`        | `places#delete`   |



#### Recommended Request bodies

Request - users#signup:

```json
{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password",
      "password_confirmation": "an example password"
    }
}
```

Request - places#create (requires a token):

```json
{
    "place": {
        "title": "restaurant name",
        "desc": "this is a place to eat",
        
    }
}
```

### Token Auth Strategy

Send the token as `Bearer Token <token>`