const axios = require('axios');
const url = 'http://localhost:3009/users';
const uuid = require('uuid');

describe('Validating Users', ()=>{
    test('should get all users data', async() => {
        const response = await axios.get(url);
        expect(response.status).toBe(200);
        expect(response.data.status).toBe(true);
    });

})