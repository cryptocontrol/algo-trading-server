import * as React from 'react'
import server from '../../../src/server'
import './style.sass'


interface IState {
  error?: string
  loading: boolean
  messages: string[]
  password: string
  isServerRunning: boolean
}


export default class Home extends React.Component<{}, IState> {
  instance: any


  state: IState = {
    loading: false,
    password: '',
    messages: [],
    isServerRunning: false
  }


  runServer = () => {
    this.setState({ loading: true })

    try {
      const port = process.env.PORT || 8080
      this.addMessage('starting server on port ' + port)

      process.env.SERVER_SECRET = this.state.password

      server.set('secret', this.state.password)
      this.instance = server.listen(port)

      this.addMessage('listening on port ' + port)
      this.setState({ isServerRunning: true, loading: false })
    } catch (e) {
      this.addMessage('Error! ' + e.message)
      this.setState({ error: e.message, loading: false })
    }
  }


  closeServer = () => {
    this.addMessage('shutting down server')
    this.setState({ loading: true })

    try {
      // this.instance.
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


  renderConnectInstructions () {
    if (!this.state.isServerRunning) return
    return (
      <div>
        <p>
          Great! the server is running. In the CryptoControl terminal enter in
          the following details
        </p>

        <div className="connect-inst">
          Server Url: <b>http://127.0.0.1:8080</b>
        </div>
        <div className="connect-inst">
          Password: <b>{process.env.SERVER_SECRET}</b>
        </div>
      </div>
    )
  }

  render() {
    const { isServerRunning, loading, password } = this.state

    return (
      <div id="page-home">
        <h1>CryptoControl Trading Server</h1>
        <header>
          <p>
            This server is meant to be used by the CryptoControl Terminal to execute advanced orders like stop-losses, trailing stop-losses, take profit (and more) on exchanges that don't support advanced orders.
          </p>
          <p>
            To start the server, please enter a password and
            then press the start button.
          </p>
        </header>

        <div className="divider" />

        <div>
          <div className="password-section">
            <div>
              Password (required): <input
                onChange={e => this.setState({ password: e.target.value })}
                type="text"
                placeholder="something secretive" />
            </div>
            <p>
              The password is used to encrypt all your API keys and is used to authenticate
              you from the CryptoControl terminal
            </p>
          </div>

          <div>
            <button
              onClick={this.runServer}
              disabled={isServerRunning || loading || password.length < 2} >
              Start Server
            </button>

            {/* <button
              onClick={this.closeServer}
              disabled={!isServerRunning || loading} >
                Stop Server
            </button> */}
          </div>

          {this.renderConnectInstructions()}

          <div>Server Status: &nbsp;
            {isServerRunning ?
              <b style={{ color: '#0f0' }}>Running</b> :
              <b style={{ color: '#f00' }}>Not Running</b>}
          </div>
        </div>

        <div className="divider" />
        <footer>
          <p>
            For any issues, please feel free to contact us
            at <a target="_blank" href="mailto:contact@cryptocontrol.io">contact@cryptocontrol.io</a>.
            Source code available
            at <a target="_blank" href="https://github.com/cryptocontrol/algo-trading-server">github.com/cryptocontrol/algo-trading-server</a>
          </p>
        </footer>

        {/* <div className="divider" /> */}

        {/* <div className="messages">
          <b> Message Console: </b>
          {this.state.messages.map((message, index) => {
            return (<div key={index} className="message">{message}</div>)
          })}
        </div> */}
      </div>
    );
  }
}
