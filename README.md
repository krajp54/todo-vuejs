# To-Do VueJS

App developed as a practice of the Vue.JS Framework with Firebase as a backend.

You can see a functional demo of the app at: [To-Do App](https://to-do-vuejs.web.app/)

## Getting Started :rocket:

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites 📋

The following programs are required to run the app correctly:

* [NodeJS](https://nodejs.org/)
* [Vue CLI](https://cli.vuejs.org/)

Once you have NodeJS installed you can install Vue CLI though the following command:

```bash
npm install -g @vue/cli
```

It's also necessary to create a project inside the [Firebase platform](https://firebase.google.com/) and change the credentials inside the [firebase.js](src/firebase.js) file.

## Installing 🔧

You need to run the following command in your terminal to install all the project dependencies.

```bash
npm install
```

## Set up the local environment ⚙️

Once the necessary dependencies for the project have been installed. We'll proceed to set up the local enviroment through the following command:

```bash
npm run serve
```

The local server will open in the following url and port:

* <http://localhost:8080/>

## Build the project 🔩

To build the code that will be used to deploy the app we'll use the following command:

```bash
npm run build
```

## Deployment 📦

This project was deployed within the Firebase hosting service. You can check it in the link at the top of this README file.

In case, you need to deploy the project under your own domain, you can make use of the firebase-tools library previously installed. You can follow the next steps:

1. Log in to Firebase though the following command.

```bash
npx firebase login
```

2. Link the Firebase project with the project folder on your local enviroment and set up the hosting service.

```bash
npx firebase init
```

3. Deploy the project to Firebase Hosting.

```bash
npx firebase deploy
```

## Build With  🛠️

* [Vue.JS](https://vuejs.org/)
* [Bootstrap Vue](https://bootstrap-vue.org/)
* [Firebase](https://firebase.google.com/)
* [Vuefire](https://vuefire.vuejs.org/)

## Authors ✒

* **Juan Pablo Rodríguez** - [krajp54](https://github.com/krajp54)
