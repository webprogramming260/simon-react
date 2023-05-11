import {defineConfig} from 'vite';

export default defineConfig(({command}) => {
  if (command === 'dev') {
    return {
      server: {
        proxy: {
          // string shorthand for simple case
          '/api': 'http://localhost:3000',

          // // Proxying websockets or socket.io
          // '/socket.io': {
          //   target: 'ws://localhost:5174',
          //   ws: true
          // }
        },
      },
    };
  }
  return {};
});
