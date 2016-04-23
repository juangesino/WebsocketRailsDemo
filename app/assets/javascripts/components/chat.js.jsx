var Chat = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: "/ajax/messages",
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="chatApp">
        <div className="chat-panel panel panel-primary">
          <ChatHeader/>
          <ChatConversations conversations={this.state.data}/>
          <ChatForm/>
        </div>
      </div>
  );
  }
});

var ChatHeader = React.createClass({
  render: function() {
    return (
      <div className="panel-heading">
        <span className="chat-glyphicon glyphicon glyphicon-comment"></span>
         <span> Chat</span>
        <div className="btn-group pull-right">
          <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
            <span className="chat-glyphicon glyphicon glyphicon-chevron-down"></span>
          </button>
          <ul className="dropdown-menu chat-slidedown slidedown">
            <li>
              <a href="http://www.jquery2dotnet.com">
                <span className="chat-glyphicon glyphicon glyphicon-refresh"></span>Refresh</a>
            </li>
            <li className="divider"></li>
            <li>
              <span className="chat-glyphicon glyphicon glyphicon-off"></span> Sign Out
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

var ChatConversations = React.createClass({
  render: function() {
    return (
      <div className="chat-panel-body panel-body" id="scroll-panel">
        <ul className="chat">
          {this.props.conversations.map(function(conversation) {
            return (
              <ChatConversation key={conversation.id} user={conversation.user} message={conversation.text} orientation='left' time={conversation.time} />
            );
          })}
        </ul>
      </div>
    );
  }
});

var ChatForm = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.sendFormData();
  },
  sendFormData: function () {
    new_message = ReactDOM.findDOMNode(new_message).value;
    $.ajax({
      method: "POST",
      url: "/ajax/messages",
      dataType: 'json',
      cache: false,
      data: {
        text: new_message
      },
      success: function(data) {
        this.setState({text: ''});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="panel-footer">
        <form action="" onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input id="new_message" name="new_message" type="text" className="form-control input-sm" placeholder="Type your message here..." value={this.state.text} onChange={this.handleTextChange} />
            <span className="input-group-btn">
              <button className="btn btn-warning btn-sm" id="btn-chat" type="submit">Send</button>
            </span>
          </div>
        </form>
      </div>
    );
  }
});

var ChatConversation = React.createClass({
  render: function() {
    return (
      <li className={"clearfix " + this.props.orientation}>
        <span className={"chat-img pull-" + this.props.orientation}>
          <img src={this.props.user.image} alt="User Avatar" className="chat-img img-circle img-responsive"/>
        </span>
        <div className="chat-body clearfix">
          <div className="header">
            <strong className={ this.props.orientation == 'right' ? "pull-right primary-font" : "primary-font" }>{this.props.user.email}</strong>
            <small className={ this.props.orientation == 'right' ? "text-muted" : "pull-right text-muted" }><span className="chat-glyphicon glyphicon glyphicon-time"></span>{this.props.time}</small>
          </div>
          <p>
            {this.props.message}
          </p>
        </div>
      </li>
    );
  }
});
