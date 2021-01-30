import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ChatRoom from "./ChatRoom.jsx";

function Chat() {
  return (
    <Router>
      <Switch>
      <Route path="/" component={ChatRoom} />
      </Switch>
    </Router>
  );
}

export default Chat;
