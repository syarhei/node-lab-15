module.exports = (Sequelize,sequelize)=>{
    return sequelize.define('users',{
        name: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        password: Sequelize.STRING,
        contact: Sequelize.STRING,
        balance: Sequelize.INTEGER
    });
};