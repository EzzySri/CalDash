var UserProfile = React.createClass({
  getInitialState: function() {
    return {
      username: gon.last_name,
      profileImageUrl: '',
      shouldExpand: false
    };
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          username: data[0].username,
          profileImageUrl: data[0].profile_image_url
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  toggleDropDownMenu: function() {
    this.setState({shouldExpand: !this.state.shouldExpand});
  },
  render : function() {
    return (
      <div className="user-profile">
        <img className="profile-picture fl" src={this.state.profileImageUrl}></img>
        <div className="user-profile-right fl">
          <div className="username-container clear-float">
            <div className="username-text fl">
              {this.state.username}
            </div>
            <div className="profile-dropdown-button fl" onClick={this.toggleDropDownMenu}></div>
          </div>
          <ProfileDropDownMenu shouldExpand={this.state.shouldExpand}/>
        </div>
      </div>
    );
  }
});

var ProfileDropDownMenu = React.createClass({
  render: function() {
    var classString = "drop-down-menu";
    if (!this.props.shouldExpand) {
      classString += " hidden"
    }
    return (
      <ul className={classString}>
        <li className="drop-down-text-container">Sign Up</li>
        <li className="drop-down-text-container">Sign Out</li>
        <li className="drop-down-text-container">My Profile</li>
      </ul>
    );
  }
});

