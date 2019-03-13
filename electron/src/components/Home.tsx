import * as React from 'react'
import server from '../../../src/server'
import './style.sass'

interface IState {
  isServerRunning: boolean
}

let instance, serverWindow;

export default class Home extends React.Component<{}, IState> {

  state: IState = {
    isServerRunning: false
  }


  runServer = () => {
    try {
      const port = process.env.PORT || 8080
      instance = server.listen(port, () => console.log('listening on port', port))
      serverWindow = window.open('http://localhost:8080')
      this.setState({ isServerRunning: true })
    } catch(e) {
      console.error(e)
    }
  }


  closeServer = () => {
    try {
      instance.close()
      serverWindow.close();
      console.log('Server closed')
      this.setState({ isServerRunning: false })
    } catch(e) {
      console.error(e)
    }
  }


  render() {
    const { isServerRunning } = this.state

    return (
      <div id="page-home">
        <h1>CryptoControl Trading Server</h1>
        <p>
          To start the server, please enter a password and
          then press the start button.
        </p>

        <div>
          <div>
            <button
              onClick={this.runServer}
              disabled={isServerRunning} >
                Run Server
            </button>

            <button
              onClick={this.closeServer}
              disabled={!isServerRunning} >
                Stop Server
            </button>
          </div>

          <div>Server Status: &nbsp;
            {isServerRunning ?
              <b style={{ color: '#0f0' }}>Running</b> :
              <b style={{ color: '#f00' }}>Not Running</b>}
          </div>

        </div>
      </div>
    );
  }
}
