# Twitterish

Twitterish is a Twitter-like web app build on Django and React.

### Design Overview

Twitterish is composed of 4 Dockerized components:

1. **Postgres database**

2. **NGINX web server, reverse proxy** - Handles incoming HTTP requests and routes the request to either the Django backend or the React web app

3. **Django backend** - Runs on port 8000. Includes a standard backend admin dashboard and all of the API endpoints

4. **React web app** - Runs on post 8001. The main web app. Interacts with the backend via RESTful API calls.

### The API

When a user authenticates via the web app or elsewhere, they are granted a token that is passed via Authorization header with every request to the backend.

Here is a list of the supported endpoint:

- `GET /api/v1/users/` - Returns a list of users
- `GET /api/v1/users/following/` - Returns a list of all of the users the current user is following
- `POST /api/v1/users/follow/` - Follow a user
- `POST /api/v1/users/unfollow/` - Unfollow a user
- `PUT /api/v1/privacy/` - Change the current users privacy setting
- `POST /api/v1/auth/token/create/` - Authenticates a user and returns a token (login)
- `POST /api/v1/auth/token/destroy/` - Destroys the users token (logout)
- `GET /api/v1/auth/me/` - Return the current user
- `GET /api/v1/feed/` - Returns the current user's main feed
- `GET /api/v1/feed/:username` - Returns a user's posts unless that user is private and you don't follow them
- `GET /api/v1/post/:id` - Returns a single post unless that user is private and you don't follow them
- `POST /api/vi/post/` - Creates a new post

You can browse to any of these endpoints (ie. http://localhost:8000/api/v1/users/), although a lot of them will return a 403 Forbidden since they expect a valid token in the Authorization header.

**Notes**

- I could have built a more static website utilizing Django's templating features, but making all data access via REST API is more scalable, especially if we want to add a mobile app or something one day.

## Running Twitterish

### Requirements

Running Twitterish requires [Docker and Docker Compose](https://www.docker.com/get-docker)

### Setup/Startup

- Clone this repo

- Make sure port 8000 and 8001 are free on you machine (these ports are used by the backend and the web app). If you _really_ want to change the ports you can go into the docker-compose.yml file and change them there.

- From the root directory of the repo, run `docker-compose up --build` Note: sudo may be required for certain configurations

This command will build and start the 4 containers. It will probably take a few minutes. Maybe get a coffee in the meantime :)

You should see a lot of output on the screen. You may notice that the backend Django server (twitterish-api01) performing initial database migrations, automatic superuser creation, running unit tests, etc.

The servers are ready when the web server (twitterish-web01) finishes compiling. It will say "You can now view web in the browser. Local: http://localhost:3000/" IGNORE THIS. The app runs on port 3000 inside the docker container, but is exposed to the host via port 8001.

You should now be able to visit see the app running on http://localhost:8001/

You should also be able to visit the backend dashboard at http://localhost:8000/admin (you can login with admin/admin)

**Addition Functionality**

- To add some fake user and fake post data to the database, run `docker exec twitterish-api01 /bin/sh -c "python manage.py loaddata initial_data`

- To run the backend unit tests, run `docker exec twitterish-api01 /bin/sh -c "python manage.py test api.feed accounts.api --noinput` (this happens automatically on server startup)

**Notes:**

- You may have noticed that the React App is running in Development mode. I left it this way so that it could be easily tinkered with.

- The main reason `docker-compose up --build` takes so long is because of workaround for a bug in the node-sass-chokidar package. After the initial build you can go into docker-compose.yml and comment line 30 and uncomment line 31. This will speed up subsequent `docker-compose up` significantly.

### The Web App

The web app is simple and pretty self explanatory. If you're not logged in, you are able to login, sign up, or view the user list. Clicking on a user will take you to their feed. If that user is private, you will not be able to see their posts.

Once you login, if you return to the user list page, you will now have the ability to follow other users. By doing so, their posts will appear in your main feed. If you follow someone who is private, you will now be able to see their posts. You can also write a new post of your own.

If you click on your own username, you can see all of the posts you've made. You also have the ability to set you feed to private or public.

### The Admin Dashboard

The backend dashboard allows you to review and/or edit all of the data in the system. This is useful if you want to edit another user's privacy settings for testing purposes (go to Users, pick a user and at the bottom there's a "privacy" checkbox)


##TODOs and General Comments

- Form validation is not great. I would flesh it out more in a real world scenario.
- My unit tests are pretty rudimentary on the backend and non-existent on the front-end. I would definitely want to add more coverage.
- In the real world, I'd divide the front and backend into separate repos.

