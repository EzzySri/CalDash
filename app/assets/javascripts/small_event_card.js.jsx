define(['react', 'constants'], function(React, Constants){
  var SmallEventCard = React.createClass({
    render : function() {

      var momentStrFormat = "Do, h:mm a";
      var source = this.props.eventSource;
      var bannerText;
      if (source.example) {
        bannerText = "Example";
      } else if (source.mandatory) {
        bannerText = "Fixed";
      } else {
        bannerText = "Flexible";
      }
      
      return (
        <div className="small-event-card">
          <div className="banner"><div className="copy">{bannerText}</div></div>
          <div className="event-card-left-container vert-ctr">
            <div className="event-icon-container">
              <img src={"/assets/" + Constants.CategoryImagePairs[source.category]} className="event-icon"></img>
            </div>
            <div className="event-name-container">{source.name}</div>
          </div>
        </div>
      );
    }
  });
  return SmallEventCard;
});