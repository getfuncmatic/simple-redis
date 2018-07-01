var redis = require("../lib/redis")
  
describe('Redis', () => {
  it ('should connect and disconnect', async () => {
    var client = await redis.connect({
      uri: process.env.REDIS_ENDPOINT,
      password: process.env.REDIS_PASSWORD
    })
    expect(client).toBeTruthy()
    await client.quit()
    expect(client.client.connected).toBeFalsy()
  })
  it ('should connect get and set', async () => {
    var client = await redis.connect({
      uri: process.env.REDIS_ENDPOINT,
      password: process.env.REDIS_PASSWORD
    })
    await client.set('hello', 'world')
    var val = await client.get('hello')
    expect(val).toBe('world')
    await client.del('hello')
    var val2 = await client.get('hello')
    expect(val2).toBeFalsy()
    await client.quit()
  })
})


