# embedded-postgres-cli

> Command line interface for embedded postgres",

## Installation

**Using yarn**

```shel
yarn add embedded-postgres-cli
```

**Using npm**

```shel
npm install embedded-postgres-cli
```

## Usage

You can run the command from yarn `yarn pge` or simply `pge` if you install it
globally.

```shel
pge --help

Usage: pge [options] [command]

Options:
  -h, --help       display help for command

Commands:
  start [options]  example command with default simple usage
  help [command]   display help for command
```

### Start command

```shel
pge start --help

Usage: pge start [options] [database]

Start the PostgreSQL server

Arguments:
  database           The name of a database to create

Options:
  --user <USER>      The admin username (default: "admin")
  --password <PASS>  The admin password (default: "admin")
  --port <PORT>      The server port (default: 5432)
  --data <PORT>      The data directory (default: "/Users/aegiro/code-mine/embedded-postgres-cli/.pg-data")
  -h, --help         display help for command
```

### Clean command

```shel
pge clean --help

Usage: pge clean [options]

Remove the data from previous run of the server

Options:
  --data <PORT>  The data directory (default: "/Users/aegiro/code-mine/embedded-postgres-cli/.pg-data")
  -h, --help     display help for command
```

## Configuration

You can save the configuration in an RC file name .embedded-postgresrc so you
don't have to add the pass and port for every invocation of the command and you
can still overwrite on the command line.
The file is in JSON format and all keys are optional.

**example**
```json
{
  "user": "admin",
  "password": "admin",
  "port": 5432,
  "data": "",
  "databases": [
    "database_1",
    "database_1"
  ]
}
```
