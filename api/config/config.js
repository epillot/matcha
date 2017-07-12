const mongoConfig = 'mongodb://epillot:42yopyop42@cluster0-shard-00-00-lm5ht.mongodb.net:27017,cluster0-shard-00-01-lm5ht.mongodb.net:27017,cluster0-shard-00-02-lm5ht.mongodb.net:27017/Matcha?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

const mailerConfig = {
  host: 'smtp.laposte.net',
  port: 465,
  secure: true,
  auth : {
    user: 'matcha-epillot@laposte.net',
    pass: 'Matcha42'
  }
}

const jwtSecret = 'JLsnn45HdSlmKsjkslskl';

export default { mongoConfig, mailerConfig, jwtSecret};
