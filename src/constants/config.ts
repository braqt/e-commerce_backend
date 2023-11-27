interface ENV {
  PORT: string | undefined;
  MONGO_URI: string | undefined;
  IMGUR_APP_CLIENT_ID: string | undefined;
  CERT: string | undefined;
  REDIS_DB_HOST: string | undefined;
  REDIS_DB_PORT: string | undefined;
  REDIS_DB_PASSWORD: string | undefined;
}

interface Config {
  PORT: string;
  MONGO_URI: string;
  IMGUR_APP_CLIENT_ID: string;
  CERT: string;
  REDIS_DB_HOST: string;
  REDIS_DB_PORT: string;
  REDIS_DB_PASSWORD: string;
}

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    IMGUR_APP_CLIENT_ID: process.env.IMGUR_APP_CLIENT_ID,
    CERT: process.env.CERT,
    REDIS_DB_HOST: process.env.REDIS_DB_HOST,
    REDIS_DB_PORT: process.env.REDIS_DB_PORT,
    REDIS_DB_PASSWORD: process.env.REDIS_DB_PASSWORD,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const envVars = getSanitzedConfig(config);

export default envVars;
