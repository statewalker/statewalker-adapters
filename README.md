
# @statewalker/adapters

This library implements the [Adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern) in JavaScript.

> Adapters allow dynamically adjust JavaScript objects to various contexts without changing objects nor contexts. Adapters implement "late binding" between objects and allows to create applications with high cohesion and low coupling between individual parts.

Examples of usage of this pattern:

Example 1: Show in a context menu file-specific operations - resize images, share files or apply spellchecker for texts. Completely different files - image, audio files or texts - can be adapted to add file-specific operations in the menu. 

Example 2: The same image can have different adapters in a file manager menu and in an image-editing interface (ex: update curves or luminosity).

All these requirements can be covered by using this simple adapter class.

## Usage

```js

// Create an adapter registry
const registry = new Adapters();

// Register adapters from one type to another:
registry.set("menu", "file", { ... }); // An adapter for files
registry.set("menu", "configuration", { ... }) // Configuration menu 
registry.set("menu.context", "audio", { ... }) // Register a audio-player specific operations in the menu
... 

// Use the registered adapters:
const obj = ...; // An object for which we want to find an adapter for a specific context.
                 // In this case the context is the menu.
const operations = registry.getAll("menu", obj.type);
// Do something for 

```

## Example

```js
// Create a new adapters registry
const registry = new Adapters();

// Register an adapter providing new menu operations for files: copy, delete and move:
registry.set("menu", "file", new MenuItems([
  { label : "Copy", action : copyFileAction },
  { label : "Delete", action : deleteFileAction },
  { label : "Move", action : moveFileAction },
]))

// Register image-specific operations - resize and share: 
registry.set("menu", "file.image", new MenuItems([
  { label : "Resize Image", action : resizeImageAction },
  { label : "Share Image", action : shareImageAction },
]))

// Add image-specific operations for a context menu - update image liminosity:
registry.set("menu.images", "file.image", new MenuItems([
  { label : "Update Luminosity", action : updateImageLuminosityAction },
]))

// Now we can use these adapters to show menus reflecting operations specific for files:
const file1 = ...; // Get file from somewhere with the type "file.binary"
const file1MenuItems = registry.getAll("menu", file.type);
// It will contains 3 operations: "Copy", "Delete", "Move"

const imageFile = ...;
const imageMenuItems = registry.getAll("menu", imageFile.type);
// The returned list of operations will contain the "Copy", "Delete", "Move" items
// (like for all other files), but also the "Resize Image" and "Share Image" options.

```

## `Adapters` Class Methods

* `constructor(separator = '.')` - constructor defines the separator character used to transform type strings to hierarchies

* `set(from, to, adapter)` - registers an adapter from the type `from` to the type `to`. The `adapter` is the adapter instance. `from` and `to` parameters are strings representing hierarchy of the adaptable and target types.

* `get(from, to, fromExact = false, toExact = false)` - returns an adapter from one class to another;
  - if the `fromExact` parameter is `true` then this method return an adapter (if any) for the exact type defined by the first (`from` parameter)
  - if the `toExact` parameter is `true` then this method returns an adapter for the exact target type (`to` type) and it do not try to expand the resulting type

* `getAll(from, to, fromExact = false, toExact = false)` - returns all adapters from the initial to the target types; the meaning of the `fromExact` and `toExact` parameters is the same as for the `get(...)`method - they enable/disable types expansion

* `remove(from, to)` - removes the registered adapter from the initial type to the target type
