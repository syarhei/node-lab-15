"use strict"
module.exports = (domain) => {

    function DomainServices(domain) {

        this.checkDomain = checkDomain;
        this.getDomains = getDomains;
        this.getDomainsLimit = getDomainsLimit;
        this.addDomain = addDomain;
        this.deleteDomain = deleteDomain;

        function checkDomain(user) {
            return new Promise((resolve, reject) => {
                domain.findById(user.name).then(resolve).catch(reject);
            })
        }

        function getDomains(user) {
            return new Promise((resolve, reject) => {
                domain.findAll({where: {userName: user}}).then(resolve).catch(reject);
            });
        }

        function getDomainsLimit(user, params) {
            let offset = Number((params.offset - 1) * params.limit);
            let limit = Number(params.limit);
            return new Promise((resolve, reject) => {
                domain.findAll({ offset: offset, limit: limit, where: {userName: user}}).then(resolve).catch(reject);
            })
        }

        function addDomain(user, params) {
            let object = {
                name: params.name,
                cost: params.cost,
                userName: user
            };
            return new Promise((resolve, reject) => {
                domain.create(object).then(resolve).catch(reject);
            })
        }

        function deleteDomain(user, name) {
            return new Promise((resolve, reject) => {
                domain.destroy({where: {name: name, userName: user}}).then(resolve).catch(reject);
            })
        }
    }

    return new DomainServices(domain);
};