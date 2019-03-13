import * as React from 'react';
import server from '../../../src/server'

let styles = require('./Home.scss');

export default class Home extends React.Component {

  runServer() {
    const port = process.env.PORT || 8080
    server.listen(port, () => console.log('listening on port', port))
  }

  render() {
    return (
      <div className={styles.home}>
        <div className={styles.container} data-tid="container">
          <button onClick={this.runServer}>Run Server</button>
        </div>
      </div>
    );
  }
}
