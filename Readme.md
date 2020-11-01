# Integrasi MIPA Server

## Documentation Link

Postman Documentation : [here](https://documenter.getpostman.com/view/6308700/TVYAhgaD)

## How to start

1. Install MongoDB & check mongo is started with `mongod` or `mongo`

2. Run `npm install`

3. Copy `.env.example` to `.env` and modify with your configuration

4. Run `npm run dev`

## How to deploy with docker

Soon

## Planning

### Authentication

* Login : `POST /auth/login`
* Change password : `PUT auth/changePassword`

### Card Verification

* Get all record : `GET /verification/card?skip=0&limit=10&purpose=VERIFY_HIMA_VOTE&major=TI`
* Create record (Upload KTM) : `POST /verification/card`
* Verify record - Admin Only : `PUT /verification/card`

### User

* Get self profile : `PUT user/me`

### Candidate

#### KaBEM candidate

* Get all KaBEM candidates              : `GET /candidate/bem`
* Get candidate                         : `GET /candidate/bem/:id`
* Input KaBEM candidate - Admin Only    : `POST /candidate/bem`
* Update KaBEM candidate - Admin Only   : `PUT /candidate/bem`
* Delete KaBEM candidate - Admin Only   : `DELETE /candidate/bem/:id`

#### BPM candidate

* Get all BPM candidates                : `GET /candidate/bpm`
* Get candidate                         : `GET /candidate/bpm/:id`
* Input BPM candidate - Admin Only      : `POST /candidate/bpm`
* Update BPM candidate - Admin Only     : `PUT /candidate/bpm`
* Delete candidate - Admin Only         : `DELETE /candidate/bpm/:id`

#### Hima candidate

* Get all KaHim candidates              : `GET /candidate/hima?major=TI`
* Get candidate                         : `GET /candidate/hima/:id`
* Input KaHim candidates - Admin Only   : `POST /candidate/hima`
* Update KaHim candidates - Admin Only  : `PUT /candidate/hima`
* Delete candidate - Admin Only         : `DELETE /candidate/hima/:id`

### Vote

* Vote candidate            : `POST /vote`
<!-- Vote result must contains count of vote per candidate, total -->
* Get vote result - Admin Only : `GET /vote?type=hima&major=TI&daily=true&from=date&until=date&isVerified=true`
