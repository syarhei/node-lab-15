module.exports = (Sequelize, config) => {

    const cf = process.env.NODE_ENV === 'production' ? config.pg : config.db;

    const options = {
        host: cf.host,
        dialect: cf.dialect,
        logging: false,
        define: {
            timestamps: true,
            paranoid: true,
            defaultScope: {
                where: {
                    deletedAt: { $eq: null }
                }
            }
        }
    };

    const sequelize = new Sequelize(cf.name, cf.user, cf.password, options); // подключаемся к БД
    const user = require('../models/user')(Sequelize, sequelize);  // определяем все наши объекты базы данных
    const domain = require('../models/domain') (Sequelize, sequelize);

    user.hasMany(domain);
    domain.belongsTo(user);

    return {
        user: user,
        domain: domain,
        sequelize: sequelize
    };
};