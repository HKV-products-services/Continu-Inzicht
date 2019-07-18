# Async-Actions

This directory contains the async actions. For our async actions we use [`redux-thunk`](https://github.com/reduxjs/redux-thunk).

## Working with maps

Since most of our applications are focussed around maps we need a clean way to interact with a map.
For this we use `redux-thunk`. The idea is to extract the actions which are performed on the map (side-effects) into these `async-actions`. These async actions have access to the map and can perform the desired operations.
After we do our work on the map we can update the application state with a dispatch of a regular/synchronous action to redux.

## Modules

Like with our reducers we provide a generic interface to interact with layers on the map.
For every layer type (by default geojson and wms) we have submodules that implement the desired behaviour. If we want to extend our actions to support more types we need to define a new submodule and update the `overlays` module to use this new module.
