/**
 * Created by Sergei on 16.05.2017.
 */

let app = require('../../index');

const app_test = require('supertest') (app);

function input(user, pass) {
    return app_test.post('/api/sessions')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ params: {
            user: user,
            pass: pass
        }})
        .expect(200);
}

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic2VyZyIsImlhdCI6MTQ5NDkxNTcxMywiZXhwIjoxNDk1NzE1NzEzfQ.rGIB58VbWT4EBTs9tKBeal6OTdSAOwWF5qfZMQjU7Yw';

function getDomains() {
    return app_test.get('/api/users/domains')
        .set('Cookie', 'token='+token)
        .expect(200);
}

describe('users', () => {
    it('success sign in', async () => {
        let domains = await input("serg", "111");
        let text = JSON.parse(domains.text);
        //console.log(text);
        expect(text.message).toBeDefined();
    });
    it('error sign in', async () => {
        let domains = await input("serg", "222");
        let text = JSON.parse(domains.text);
        //console.log(text);
        expect(text.error).toBeDefined();
    });
});

describe('domains', () => {
    it('get', async () => {
        let domains = await getDomains();
        let text = JSON.parse(domains.text);
        //console.log(text);
        expect(text.domains).toBeDefined();
    });
});