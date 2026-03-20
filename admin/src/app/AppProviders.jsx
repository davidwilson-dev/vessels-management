import { CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { store } from './store'
import { appTheme } from './theme'

function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3200}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </ThemeProvider>
    </Provider>
  )
}

export default AppProviders
