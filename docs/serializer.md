# Serializer

A serializer is a function used to convert a node from a state into a string. The signature is `serialize(state: State, node: Node): String`. If the serializer can't serialize this node, it should return `null` or `undefined`.

The module `Serializer` provides different helpers to create serialization.

### `Serializer.matchType`
`Serializer.matchType(type: String|Array|Function) => Serializer`

Limit the serializer to a certain type of nodes.
