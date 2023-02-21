# Weavr Web

- [production deployment](https://www.weavr.org)
- [test deployment](https://test.weavr.org)


## Contribution Guidelines

Open a new branch off of `main` with naming scheme:

`<your-name>/<feature>`

General rules:

- Branches should aim to be as small in scope as possible and merge back into
  `main` in a timely fashion.
- Open a draft pull request as soon as possible detailing the changes made in
  your branch and open it for review when complete.
- Try to coordinate with other contributors via Discord as much as possible to
  avoid crossover and potential merge conflicts.
- Push your code so we know what you're doing! (even if its not done or working
  yet).

## Project setup

```
yarn
```

You'll also need to create a .env file with the variables VUE_APP_PROJECT_ID and
VUE_APP_PROJECT_SECRET to run this project. Contact a dev for these values.

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

## Customize configuration

## Proposal Blacklist
Weavr blocks proposals from certain users and addresses. 
Mechanically this is done by editing the `blacklist` file in `src/blacklist.json`.
If you need to add an address to that list, please open a ticket.

See [Configuration Reference](https://cli.vuejs.org/config/).
