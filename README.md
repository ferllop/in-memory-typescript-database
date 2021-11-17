# In-Memory typescript database

An in-memory database done using javascript map function to be able to test the
data access layer of my projects.

This is the interface:
 - insert(collection: string, entity: Entity) 
 - update(collection: string, entity: Entity)
 - delete(collection: string, id: Id)
 - find(collection: string, finder: Finder)
 - findById(id: Id)
 - getCollection(collection: string)
 - getCollections()
 - clean() 

Entity is any javascript object with an id property with an Id.
Id is a string.
Finder is a function that receives an entity and returns a boolean.

You can import the synchronous or the asynchronous version.

## Asynchronoy version
The asynchronous version just wraps the synchronous version with promises.

You can pass a number to the constructor to simulate a delay in the response or set it
dynamically with the added method setDelay(delay: number). 
By default the delay is set to zero.
 
