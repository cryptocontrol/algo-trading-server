import * as React from 'react'
import server from '../../../src/server'


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
      <div style={{ fontFamily: 'arial' }}>
        <div style={{ background: '#1b1b1b', height: '100vh', position: 'relative', padding: '10px' }} data-tid="container">
          <div style={{ position: 'absolute', top: '40%', left: '45%' }}>
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

          <div style={{ color: '#fff' }}>Server Status: &nbsp;
            {isServerRunning ?
              <b style={{ color: '#0f0' }}>Running</b> :
              <b style={{ color: '#f00' }}>Not Running</b>}
          </div>

        </div>
      </div>
    );
  }
}
