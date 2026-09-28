import convict from 'convict';

export interface IConfig {
  env: string;
  secret_key: string;
  server: {
    port: number;
    requestTimeout: number;
  };
  api: {
    baseURL: string;
  };
  database: {
    connectionName: string;
    databaseType: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    cacheDuration: number;
    maxQueryExecutionTime: number;
    readReplicationSlaves: string;
  };
  aws: {
    region: string;
    cognitoPoolID: string;
    clientId: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  apiDocs: {
    username: string;
    password: string;
  };
  allowedOrigin: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
  };
}

const config = convict<IConfig>({
  env: {
    format: ['local', 'production', 'development'],
    env: 'NODE_ENV',
    arg: 'node-env',
    default: 'local',
  },
  secret_key: {
    format: String,
    env: 'secret_key',
    default: '',
  },
  server: {
    port: {
      format: 'port',
      env: 'NODE_PORT',
      default: 4001,
    },
    requestTimeout: {
      format: Number,
      env: 'NODE_REQUEST_TIMEOUT',
      default: 180000,
    },
  },
  api: {
    baseURL: {
      format: String,
      env: 'API_BASEURL',
      default: '/api/v1',
    },
  },
  database: {
    connectionName: {
      format: String,
      env: 'CONN_NAME',
      default: '',
    },
    databaseType: {
      format: String,
      env: 'TYPEORM_CONNECTION',
      default: '',
    },
    host: {
      format: String,
      env: 'TYPEORM_HOST',
      default: '',
    },
    port: {
      format: 'port',
      env: 'TYPEORM_PORT',
      default: 0,
    },
    username: {
      format: String,
      env: 'TYPEORM_USERNAME',
      default: '',
    },
    password: {
      format: String,
      env: 'TYPEORM_PASSWORD',
      default: '',
    },
    database: {
      format: String,
      env: 'TYPEORM_DATABASE',
      default: '',
    },
    cacheDuration: {
      format: Number,
      env: 'TYPEORM_CACHE_DURATION',
      default: 360000, // 1 hour
    },
    maxQueryExecutionTime: {
      format: Number,
      env: 'TYPEORM_MAX_QUERY_EXECUTION_TIME',
      default: 300,
    },
    readReplicationSlaves: {
      format: String,
      env: 'TYPEORM_READ_REPLICATION_SLAVES', // comma separated hostnames of read relication slaves
      default: '',
    },
  },
  aws: {
    region: {
      format: String,
      env: 'AWS_REGION',
      default: '',
    },
    cognitoPoolID: {
      format: String,
      env: 'AWS_COGNITO_POOL_ID',
      default: '',
    },
    clientId: {
      format: String,
      env: 'AWS_COGNITO_CLIENT_ID',
      default: '',
    },
    accessKeyId: {
      format: String,
      env: 'AWS_ACCESS_KEY_ID',
      default: '',
    },
    secretAccessKey: {
      format: String,
      env: 'AWS_SECRET_ACCESS_KEY',
      default: '',
    },
  },
  apiDocs: {
    username: {
      format: String,
      env: 'APIDOCS_USERNAME',
      default: 'test',
    },
    password: {
      format: String,
      env: 'APIDOCS_PASSWORD',
      default: 'test',
    },
  },
  allowedOrigin: {
    format: String,
    env: 'ALLOWED_ORIGIN',
    default: '',
  },
  smtp: {
    host: {
      format: String,
      env: 'SMTP_HOST',
      default: 'smtp.gmail.com',
    },
    port: {
      format: 'port',
      env: 'SMTP_PORT',
      default: 587,
    },
    secure: {
      format: Boolean,
      env: 'SMTP_SECURE',
      default: false,
    },
    user: {
      format: String,
      env: 'SMTP_USER',
      default: '',
    },
    pass: {
      format: String,
      env: 'SMTP_PASS',
      default: '',
    },
    from: {
      format: String,
      env: 'SMTP_FROM',
      default: '',
    },
  },
});

config.validate({ allowed: 'strict' });

const configuration = config.getProperties();

export default configuration as IConfig;
