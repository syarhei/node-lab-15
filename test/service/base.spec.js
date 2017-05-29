/**
 * Created by Sergei on 15.05.2017.
 */

let domain = [
    {
        name: "serg15.murkou.ru",
        cost: 200,
        userName: "sergei"
    },
    {
        name: "serg16.murkou.ru",
        cost: 200,
        userName: "greg"
    }
];

let mockDomain = require('./../mock/repository') (domain);

let serviceDomain = require('../../services/domain') (mockDomain);

describe('domain', () => {
    it('return promise', () => {
        expect(serviceDomain.getDomains())
            .toBeInstanceOf(Promise);
    });
    it('return all domains', async () => {
        let record = await serviceDomain.getDomains("sergei");
        expect(mockDomain.findAll).toHaveBeenCalled();
        expect(record).toEqual(domain);
    });
    it('return domain by id', async () => {
        let record = await serviceDomain.checkDomain({ name: 0});
        console.log(record);
        expect(mockDomain.findById).toHaveBeenCalled();
        expect(record).toEqual(domain[0]);
    });
    it('not return domain by false id', async () => {
        let record = await serviceDomain.checkDomain({ name: 0});
        console.log(record);
        expect(mockDomain.findById).toHaveBeenCalled();
        expect(record).not.toEqual(domain[1]);
    });
    it('return created domain', async () => {
        let record = await serviceDomain.addDomain("sergei" , { name: "serg15.murkou.ru", cost: 200});
        expect(mockDomain.create).toHaveBeenCalled();
        expect(record).toEqual(domain[0]);
    });
    it('return 1 if domain is deleted', async () => {
        let record = await serviceDomain.deleteDomain("sergei", "serg15.murkou.ru");
        expect(mockDomain.destroy).toHaveBeenCalled();
        expect(record).toEqual(1);
    });
/*

    it(`Should returned error,
        if record not found`, async () => {
        expect.assertions(2);

        try {
            await await service.read(9000);
        } catch (error) {

            expect(repository.findById)
                .toHaveBeenCalled();

            expect(error).toEqual(errors.notFound);

        }
    });

    it(`Should returned error,
        if id not Int`, async () => {
        expect.assertions(2);

        try {
            await await service.read('surprise!');
        } catch (error) {

            expect(repository.findById)
                .not.toHaveBeenCalled();

            expect(error).toEqual(errors.invalidId);

        }
    });
    */
});

let user = [
    {
        name: "sergei",
        password: "111",
        contact: "ddd",
        balance: 100
    },
    {
        name: "admin",
        password: "admin",
        contact: "sss",
        balance: 100
    }
];

let mockUser = require('./../mock/repository') (domain);

let serviceUser = require('../../services/user') (mockUser);

describe('user', () => {
    it('return created user', async () => {
        let record = await serviceUser.createUser(user[0]);
        expect(mockUser.create).toHaveBeenCalled();
        expect(record).toEqual(user[0]);
    });
    it('return 1 if user is updated', async () => {
        let record = await serviceUser.updateUser(user[0], 100000);
        expect(mockUser.update).toHaveBeenCalled();
        expect(record[0]).toEqual(1);
    });
});