const { program } = require('commander');
const EmbeddedPostgres = require('embedded-postgres');
const fs = require('fs');
const { rimrafSync } = require('rimraf');

const DEFAULTS = {
  user: 'admin',
  password: 'admin',
  port: 5432,
  data: `${process.cwd()}/.pg-data`,
  databases: [],
};
function cli() {
  const config = getUserConfig();

  program.description(
    'Command line interface so start an embedded PostgreSQL server',
  );
  program
    .command('clean')
    .description('Remove the data from previous run of the server')
    .option('--data <PORT>', 'The data directory', DEFAULTS.data)
    .action((args) => {
      rimrafSync(args.data);
    });
  program
    .command('start')
    .usage('pge start [options] [..database]')
    .description(
      `
Start the PostgreSQL server

Arguments:
  database           The name of a database to create
`.trim(),
    )
    // .argument('[database]', 'The name of a database to create')
    .option('--user <USER>', 'The admin username', DEFAULTS.user)
    .option('--password <PASS>', 'The admin password', DEFAULTS.password)
    .option('--port <PORT>', 'The server port', DEFAULTS.port)
    .option('--data <PORT>', 'The data directory', DEFAULTS.data)
    .action((args, o) => {
      const databases = [...config.databases, ...o.args];
      const databaseDir = args.data;
      const pg = new EmbeddedPostgres({
        databaseDir,
        user: args.user,
        password: args.password,
        port: args.port,
        persistent: true,
      });
      const run = async () => {
        if (shouldRunInitialise(databaseDir)) {
          await pg.initialise();
        }
        await pg.start();
        await createDatabases(pg, databases);
      };

      run().then(
        () => {
          // eslint-disable-next-line no-process-exit
          // process.exit(0);
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.error('ERROR', error);
          // eslint-disable-next-line no-process-exit
          process.exit(1);
        },
      );
    });

  // Run the application
  program.parse();
}

const getUserConfig = () =>
  fs.existsSync('.embedded-postgresrc')
    ? {
        ...DEFAULTS,
        ...JSON.parse(fs.readFileSync('.embedded-postgresrc').toString()),
      }
    : DEFAULTS;

const shouldRunInitialise = (databaseDir) =>
  !(fs.existsSync(databaseDir) && fs.readdirSync(databaseDir).length > 0);

const createDatabases = async (pg, databases) => {
  if (databases.length > 0) {
    for (const name of databases) {
      try {
        await pg.createDatabase(name);
      } catch (error) {
        // Ignoring if the database has already been created
        if (!error.toString().includes('already exists')) {
          throw error;
        }
      }
    }
  }
};

module.exports = cli;
