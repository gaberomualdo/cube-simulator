# Cube Simulator

Located at [cubesimulator.com](https://cubesimulator.com).

## Pages

- Simulator
- Scrambler
- Solver
- Learn
- About

## Potential Pages To Add

- Play vs. Friend
- Events
- Community / Forum(s)

## Potential Changes

- Rename Learn page to Explore Page and Include Events In That Too

## Tech

- Webpack
- HBS
- Workbox & PWA
- SCSS
- Various reusable components as JavaScript classes

## Deploy, Run, & Test

1. Install deps

```
yarn install
```

2. Build

Build webpack and SCSS:

```
yarn build
```

3. Run server

```
yarn server
```

4. Build service worker (only do at deploy)

```
yarn build:sw
```

5. Deploy

Push to GitHub and pull at remote VPS server. No CI/CD or anything integrated at the moment. Not really necessary for this project at the moment but will likely be added in the future.

## License

Copyrighted.
