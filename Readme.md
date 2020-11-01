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

### Card Verification

* Get all record : `GET /verification/card?skip=0&limit=10&purpose=VERIFY_HIMA_VOTE&major=TI`
* Create record (Upload KTM) : `POST /verification/card`
* Verify record - Admin Only : `PUT /verification/card`

### User

* Change password : `PUT auth/changePassword`

### Candidate

* Get all KaBEM candidates              : `GET /candidate/bem`
* Get all BPM candidates                : `GET /candidate/bpm`
* Get all KaHim candidates              : `GET /candidate/hima?major=TI`
* Get candidate                         : `GET /candidate/bem/:id`
* Get candidate                         : `GET /candidate/bpm/:id`
* Get candidate                         : `GET /candidate/hima/:id`
* Input KaBEM candidate - Admin Only    : `POST /candidate/bem`
* Input BPM candidate - Admin Only      : `POST /candidate/bpm`
* Input KaHim candidates - Admin Only   : `POST /candidate/hima`
* Update candidate - Admin Only         : `PUT /candidate`
* Delete candidate - Admin Only         : `DELETE /candidate`
  
### Vote

* Vote candidate            : `POST /vote`
<!-- Vote result must contains count of vote per candidate, total -->
* Get vote result - Admin Only : `GET /vote?type=hima&major=TI&daily=true&from=date&until=date&isVerified=true`
