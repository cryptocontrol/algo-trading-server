import * as React from 'react'
import server from '../../../src/server'
import './style.sass'
import { Server } from 'http'

interface IState {
  error?: string
  loading: boolean
  messages: string[]
  isServerRunning: boolean
}


export default class Home extends React.Component<{}, IState> {
  instance: Server


  state: IState = {
    loading: false,
    messages: [],
    isServerRunning: false
  }


  runServer = () => {
    this.setState({ loading: true })

    try {
      const port = process.env.PORT || 8080
      this.addMessage('starting server on port ' + port)

      this.instance = server.listen(port, () => {
        this.addMessage('listening on port ' + port)
        this.setState({ isServerRunning: true, loading: false })
      })
    } catch (e) {
      this.addMessage('Error! ' + e.message)
      this.setState({ error: e.message, loading: false })
    }
  }


  closeServer = () => {
    this.addMessage('shutting down server')
    this.setState({ loading: true })

    try {
      this.instance.close()
      this.addMessage('server shut down')
      this.setState({ isServerRunning: false, loading: false })
    } catch(e) {
      this.setState({ error: e.message, loading: false })
      this.addMessage('Error! ' + e.message)
    }
  }


  addMessage = (text: string) => {
    this.setState({ messages: [...this.state.messages, text] })
  }


  render() {
    const { isServerRunning, loading } = this.state

    return (
      <div id="page-home">
        <h1>CryptoControl Trading Server</h1>
        <p>
          To start the server, please enter a password and
          then press the start button.
        </p>

        <div className="divider" />

        <div>
          <div>
            <button
              onClick={this.runServer}
              disabled={isServerRunning || loading} >
              Start Server
            </button>

            <button
              onClick={this.closeServer}
              disabled={!isServerRunning || loading} >
                Stop Server
            </button>
          </div>

          <div>Server Status: &nbsp;
            {isServerRunning ?
              <b style={{ color: '#0f0' }}>Running</b> :
              <b style={{ color: '#f00' }}>Not Running</b>}
          </div>
        </div>

        <div className="divider" />
        <p>For any issues, please feel free to contact us at contact@cryptocontrol.io</p>
        <p>
          Source code available
          at <a target="_blank" href="https://github.com/cryptocontrol/algo-trading-server">github.com/cryptocontrol/algo-trading-server</a>
        </p>

        <div className="divider" />

        <div className="messages">
          <b> Message Console </b>
          {this.state.messages.map(message => {
            <div className="message">{message}</div>
          })}
        </div>
      </div>
    );
  }
}
