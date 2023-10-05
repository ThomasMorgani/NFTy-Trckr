/*
    for demo purpose db is idb
    may implement backend in the future

    idb Structure
    //collections
    //trackers
    //nfts
*/

import utils from '@/services/utils'

const DB_NAME = 'nfty-trckr'
const DB_VERSION = 2
const SEED_DATA = require('@/static/data/db-seed.json')

let db = null
let openRequest = null

export default {
  add(store, item, key = 'id') {
    console.log('add')
    console.log(store, item)
    const newItem = this.setMeta({ ...item })
    if (!newItem[key]) {
      newItem[key] = utils.generateId()
    }

    return new Promise((resolve, reject) => {
      openRequest = indexedDB.open(DB_NAME, DB_VERSION)
      openRequest.onsuccess = (e) => {
        db = e.target.result
        const transaction = db.transaction(store, 'readwrite')
        const currStore = transaction.objectStore(store)
        currStore.add(newItem).onsuccess = (e) => {
          const result = e.target.result
          resolve(result)
        }
      }
      openRequest.onerror = (e) => reject(e)
    })
  },
  // createStore({ key, name }) {
  //   return new Promise((resolve, reject) => {
  //     openRequest = indexedDB.open(DB_NAME, DB_VERSION)
  //     openRequest.onsuccess = (e) => {
  //       db = e.target.result
  //       console.log('CREATE STORE?: ', name)
  //       if (!db.objectStoreNames.contains(name)) {
  //         db.createObjectStore(name, {
  //           keyPath: key,
  //         }).onsuccess((e) => resolve(e.result))
  //         return
  //       }
  //       reject(e)
  //     }
  //     openRequest.onerror = (e) => reject(e)
  //   })
  // },
  dbinit() {
    //TODO: Handle old db versions, blocked connections
    console.log('initialize db')
    return new Promise((resolve, reject) => {
      openRequest = indexedDB.open(DB_NAME, DB_VERSION)
      const objStoresModified = []
      const response = [] //[success, error]

      openRequest.onblocked = (e) => {
        db = openRequest?.result
        response[1] = { message: 'onblocked', error: e }
        alert(
          'Database out of sync. Please close all open instances and reload page.'
        )
      }

      openRequest.onerror = (e) => {
        console.log('onerror')
        console.log(e)
        console.log(e?.result)
        console.log(
          'if unknown internal error received. clearing db and closing/reopeing browser window fixes'
        )
        db = openRequest?.result
        response[1] = { message: 'onerror', error: openRequest.error }
        resolve(response)
      }

      openRequest.onsuccess = async (e) => {
        // db = openRequest?.result
        db = e.target.result
        response[0] = {
          message: 'onsuccess',
          data: db || null,
        }
        console.log(e)
        console.log('openRequest on success')
        console.log(objStoresModified)
        if (objStoresModified?.length > 1) {
          //IF UPGRADED
          for (let storeName of objStoresModified) {
            const store = SEED_DATA.find((s) => s.name === storeName)
            if (store.data) {
              console.log(store)
              for (let item of store.data) {
                console.log(item)
                try {
                  console.log('adding item to store')

                  await this.add(store.name, item)
                } catch (e) {
                  console.log('error adding item')
                }
              }
            }
          }
        }
        resolve(response)
      }

      openRequest.onupgradeneeded = async (e) => {
        console.log('onupgradeneeeded')
        const db = e.target.result
        for (let store of SEED_DATA) {
          // openRequest = indexedDB.open(DB_NAME, DB_VERSION)
          // openRequest.onsuccess = (e) => {
          //   db = e.target.result
          console.log('CREATE STORE?: ', store.name)
          console.log(db)
          if (!db.objectStoreNames.contains(store.name)) {
            const currStore = db.createObjectStore(store.name, {
              keyPath: store.key,
            })
            objStoresModified.push(store.name)
            console.log(currStore)
            // if (store.data) {
            //   for (let item of store.data) {
            //     try {
            //       console.log('adding item to store')
            //       await this.add(store.name, item)
            //     } catch (e) {
            //       console.log('error adding item')
            //     }
            //   }
            // }
          }
        }
        console.log('end of onupgrade reached..')
        // response[0] = { message: 'onupgradeneeded', data: db }
        // console.log('resolve response', response)
        // resolve(response)
      }
    })
  },
  delete(store, item) {
    console.log(store, item)
    const id = item?.id || item
    return new Promise((resolve, reject) => {
      openRequest = indexedDB.open(DB_NAME, DB_VERSION)
      openRequest.onsuccess = (e) => {
        db = e.target.result
        const transaction = db.transaction(store, 'readwrite')
        const currStore = transaction.objectStore(store)
        currStore.delete(id).onsuccess = (e) => {
          const result = e.target.result
          resolve(result)
        }
      }
      openRequest.onerror = (e) => reject(e)
    })
  },
  deleteLocalStorage(key) {
    return localStorage.delete(key)
  },
  get(store, key) {
    return new Promise((resolve, reject) => {
      openRequest = indexedDB.open(DB_NAME, DB_VERSION)
      openRequest.onsuccess = (e) => {
        db = e.target.result
        const transaction = db.transaction(store, 'readonly')
        const currStore = transaction.objectStore(store)
        currStore.get(key).onsuccess = (e) => {
          const result = e.target.result
          resolve(result)
        }
      }
      openRequest.onerror = (e) => reject(e)
    })
  },
  getAll(store) {
    return new Promise((resolve, reject) => {
      openRequest = indexedDB.open(DB_NAME, DB_VERSION)
      openRequest.onsuccess = (e) => {
        db = e.target.result
        const transaction = db.transaction(store, 'readonly')
        const currStore = transaction.objectStore(store)
        currStore.getAll().onsuccess = (e) => {
          const result = e.target.result
          resolve(result)
        }
      }
      openRequest.onerror = (e) => reject(e)
    })
  },
  getLocalStorage(key) {
    const data = localStorage.getItem(key)
    return data?.includes('[') || data?.includes('{') ? JSON.parse(data) : data
  },
  put(store, data) {
    return new Promise((resolve, reject) => {
      const putData = this.setMeta({ ...data })
      openRequest = indexedDB.open(DB_NAME, DB_VERSION)
      openRequest.onsuccess = (e) => {
        db = e.target.result
        const transaction = db.transaction(store, 'readwrite')
        const currStore = transaction.objectStore(store)
        currStore.put(putData).onsuccess = (e) => {
          const result = e.target.result
          console.log('Store updated', result)
          resolve(result)
        }
      }

      openRequest.onerror = () => {
        console.log('Error', request.error)
      }
    })
  },
  setLocalStorage(key, data) {
    const dataFixed =
      utils.isObject(data) || Array.isArray(data) ? JSON.stringify(data) : data
    localStorage.setItem(key, dataFixed)
  },
  setMeta(data) {
    const now = new Date()
    if (!data.created_at) {
      data.created_at = now.getTime()
      data.created_at_human = utils.epochToHuman(data.created_at)
    }
    data.updated_at = now.getTime()
    data.updated_at_human = utils.epochToHuman(data.updated_at)
    return data
  },
  updateLocalStorage(key, value = null) {
    if (!key || !value) return false
    const currentValue = JSON.parse(localStorage.getItem(key)) || null
    if (!currentValue) {
      this.write(key, value)
      return true
    }

    let updated = null

    if (Array.isArray(value)) {
      updated = [...currentValue, ...value]
    }
    if (Object.is(value)) {
      updated = { ...currentValue, ...value }
    }
    localStorage.setItem(key, JSON.stringify(updated))
    return true
  },
  // saveCollectionItems(id, items) {
  //   const collectionItemsData = {
  //     cached_utc: new Date().getTime(),
  //     count: items.length || 0,
  //     id,
  //   }
  //   const key = 'C-' + id
  //   console.log(id)
  //   console.log(items)
  //   console.log(collectionItemsData)
  //   console.log(key)
  //   this.write(key, JSON.stringify(collectionItemsData))
  //   return collectionItemsData
  // },

  writeLocalStorage(key, value = null) {
    if (!key || !value) return false
    if (Array.isArray(value) || Object.is(value)) {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
    return 'hello'
  },
}
