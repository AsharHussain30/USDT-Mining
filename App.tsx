import React from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './Redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import Main from './Main';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
};

export default App;
