const axios = require('axios');
const url = 'http://localhost:3009/hobbies';
const uuid = require('uuid');

describe('Validating hobbies', () => {
  test('should get all hobbies data', async() => {
    const response = await axios.get(url);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe(true);
  });
  test('should post hobbies data', async() => {
    const uniqueName = `Reading-${uuid.v4()}`;
    const hobbyData = {
    name: uniqueName,
    };
    const response = await axios.post(url, hobbyData);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('data');
    await axios.delete(`${url}/${uniqueName}`);
  });
  test('should update hobbies data', async() => {
    const urlUpdate = 'http://localhost:3009/hobbies/999999'; // Testing Hobby Id
    const uniqueName = `Null-${uuid.v4()}`;
    const hobbyData = {
    name: uniqueName,
   };
    const response = await axios.put(urlUpdate, hobbyData);
    expect(response.status).toBe(200);
  });
});