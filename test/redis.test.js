require('dotenv').config()
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
  it ('should use set commands sadd, scard, smembers', async () => {
    var client = await redis.connect({
      uri: process.env.REDIS_ENDPOINT,
      password: process.env.REDIS_PASSWORD
    })
    await client.del('setkey')
    var add1 = await client.sadd('setkey', 'hello')
    expect(add1).toBe(1)
    var add2 = await client.sadd('setkey', 'world')
    expect(add2).toBe(1)
    var card = await client.scard('setkey')
    expect(card).toBe(2)
    var dup = await client.sadd('setkey', 'hello')
    expect(dup).toBe(0)
    var card2 = await client.scard('setkey')
    expect(card2).toBe(2)
    var members = await client.smembers('setkey')
    expect(members.sort()).toEqual([ 'hello', 'world' ])
    await client.quit()
  })
})


