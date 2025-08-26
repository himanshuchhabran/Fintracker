// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//   tailwindcss(),
//   ],
//    server: {
//     host: true, // This is needed to accept connections from outside the container
//     proxy: {
//       // When a request is made to /api, it will be forwarded to your backend server
//       '/api': {
//         target: 'http://server:5000', // Use the service name 'server'
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on the mode
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env.SERVER_PORT)

  return {
    plugins: [react(),    tailwindcss(),
],
    server: {
      host: true, // Needed for Docker
      // Use the port from the .env file, with a fallback
      port: Number(env.CLIENT_PORT) || 5173, 
      proxy: {
        '/api': {
          // Use the server port from the .env file, with a fallback
          target: `http://server:${env.SERVER_PORT || 5000}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})