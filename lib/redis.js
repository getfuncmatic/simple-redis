'use strict'

const redis = require("redis")
const { promisify } = require('util')

module.exports = {
  connect
}

async function connect(options) {
  var client = redis.createClient(options.uri, { password: options.password })
  var get = promisify(client.get).bind(client)
  var set = promisify(client.set).bind(client)
  var del = promisify(client.del).bind(client)
  
  async function quit() {
    return new Promise((resolve, reject) => {
      client.on("end", () => {
        resolve(true)
        return
      })
      client.on("error", (err) => {
        reject(err)
        return
      })
      client.quit()
    })
  }
    
  return new Promise((resolve, reject) => {
    var ret = { client, get, set, del, quit }
    client.on("connect", () => {
      resolve(ret)
      return
    })
    client.on("error", (err) => {
      reject(err)
      return
    }) 
  })
}


// EX seconds -- Set the specified expire time, in seconds.
// PX milliseconds -- Set the specified expire time, in milliseconds.
// NX -- Only set the key if it does not already exist.
// XX -- Only set the key if it already exist.

// client.set('key', 'value!', 'EX', 10);

// client.get("key")

