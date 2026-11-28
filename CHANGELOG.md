# Changelog

## [1.3.0](https://github.com/Isilin/dreadcast_simulator/compare/v1.2.0...v1.3.0) (2026-11-28)


### Features

* **vercel:** redirect the production domain to dc-simulator.isilinbn.fr ([#80](https://github.com/Isilin/dreadcast_simulator/issues/80)) ([fffff8d](https://github.com/Isilin/dreadcast_simulator/commit/fffff8da9794b3d043c9508a550b5b7b5087c03d))

## [1.2.0](https://github.com/Isilin/dreadcast_simulator/compare/v1.1.2...v1.2.0) (2026-11-28)


### Features

* **auth:** own cookie sessions instead of Supabase Auth ([#78](https://github.com/Isilin/dreadcast_simulator/issues/78)) ([b37def1](https://github.com/Isilin/dreadcast_simulator/commit/b37def12d6865f933a041fb23617d83a525ab4bd))

## [1.1.2](https://github.com/Isilin/dreadcast_simulator/compare/v1.1.1...v1.1.2) (2026-11-27)


### Bug Fixes

* **server:** reject a non-postgres DATABASE_URL and time out connections ([#76](https://github.com/Isilin/dreadcast_simulator/issues/76)) ([d6bd2c1](https://github.com/Isilin/dreadcast_simulator/commit/d6bd2c17c59ba0b99eb90f6a8bdadf0608fb95b1))

## [1.1.1](https://github.com/Isilin/dreadcast_simulator/compare/v1.1.0...v1.1.1) (2026-11-27)


### Bug Fixes

* **docker:** leave empty build args out of the Vite build ([#71](https://github.com/Isilin/dreadcast_simulator/issues/71)) ([1c40865](https://github.com/Isilin/dreadcast_simulator/commit/1c408659fc2dc15ff81a1c5ddae04bc0c03c0052))

## [1.1.0](https://github.com/Isilin/dreadcast_simulator/compare/v1.0.0...v1.1.0) (2026-11-27)


### Features

* **atelier:** stat, specialization, tech budget and prerequisite filters in the kit catalogue ([#43](https://github.com/Isilin/dreadcast_simulator/issues/43)) ([9154bd3](https://github.com/Isilin/dreadcast_simulator/commit/9154bd309b9298e3c2039f6fcd449d05931e5d7f))

## 1.0.0 (2026-09-29)


### Features

* **api:** move builds, subscriptions, login and profile to Effect ([00c25e8](https://github.com/Isilin/dreadcast_simulator/commit/00c25e857fc15948a93ca1f3762d4a54467a7605))
* **api:** move the community feature to Effect ([04f5552](https://github.com/Isilin/dreadcast_simulator/commit/04f5552d4ace9c289067d34ad17ba7fbbd74f388))
* **api:** serve the API reference and import httpapi per module ([ef5f725](https://github.com/Isilin/dreadcast_simulator/commit/ef5f725d17dd2ffba2453f2926bb941e75ec2ea9))
* **api:** serve the catalog from a single Effect HttpApi function ([f86be1e](https://github.com/Isilin/dreadcast_simulator/commit/f86be1ed05bde2c2e90139a6003c85055529b4f5))
* **api:** type the responses as precisely as the front expects ([e750ff6](https://github.com/Isilin/dreadcast_simulator/commit/e750ff65d12f2c29bb6ab54cc83cf854ee8031c1))
* **front:** call the API through a client typed by its contract ([36a62dd](https://github.com/Isilin/dreadcast_simulator/commit/36a62dd829f934dbe5acf3debf4474e91d72d72c))
