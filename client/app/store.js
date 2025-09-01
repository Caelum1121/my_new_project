/**
 *
 * store.js
 * store configuration
 */

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import createReducer from './reducers';

// Create a history object for navigation
export const history = createBrowserHistory({
  basename: '/', // Base URL for all locations
  hashType: 'noslash' // Use no slash in hash-based URLs
});

// Define middlewares to be used in the store
const middlewares = [thunk, routerMiddleware(history)];

// Apply middleware to the store
const enhancers = [applyMiddleware(...middlewares)];

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

// Create the Redux store with the root reducer and enhancers
const store = createStore(
  createReducer(history),
  composeEnhancers(...enhancers)
);

// Enable Webpack hot module replacement for reducers
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require
    store.replaceReducer(nextRootReducer(history));
  });
}

export default store;
