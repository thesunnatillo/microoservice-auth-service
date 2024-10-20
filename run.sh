git submodule init
git submodule update
npm install
npm run build
npm run typeorm:generate-migration ./migrations/Users
npm run typeorm:run-migrations
npm run typeorm:seed
npm run lint
npm run start