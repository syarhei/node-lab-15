"use strict"
module.exports = (user) => {

    function AuthorService(user) {

        this.checkPass = checkPass;
        this.checkUser = checkUser;
        this.updateUser = updateUser;
        this.createUser = createUser;

        function checkUser(params) {
            return new Promise((resolve, reject) => {
                user.find({where: {name: params.name}}).then(resolve).catch(reject);
            })
        }

        function checkPass(params) {
            return new Promise((resolve, reject) => {
                user.find({where: {name: params.user, password: params.pass}}).then(resolve).catch(reject);
            })
        }

        function updateUser(name, cost) {
            return new Promise((resolve, reject) => {
                user.update({ balance: cost}, {where: {name: name}}).then(resolve).catch(reject);
            })
        }

        function createUser(object) {
            return new Promise((resolve, reject) => {
                user.create(object).then(resolve).catch(reject);
            })
        }
    }

    return new AuthorService(user);
};