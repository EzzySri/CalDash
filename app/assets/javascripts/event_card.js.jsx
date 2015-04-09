define(['react', 'constants'], function(React, Constants){
  var EventCard = React.createClass({
    getInitialState: function() {
      return {
      };
    },
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
        <div className="event-card">
          <div className="banner"><div className="copy">{bannerText}</div></div>
          <div className="col-sm-6 event-card-left-container vert-ctr">
            <div className="event-icon-container">
              <img src={"/assets/" + Constants.CategoryImagePairs[source.category]} className="event-icon"></img>
            </div>
            <div className="event-title-container">{source.title}</div>
          </div>
          <div className="col-sm-6 event-card-right-container vert-ctr">
            {source.mandatory ? (
              <div className="event-time-container">{source.from.format(momentStrFormat) + " - " + source.to.format(momentStrFormat)}</div>
            ) : (
              <div>
                <div className="event-time-container">{"> " + source.after.format(momentStrFormat)}</div>
                <div className="event-time-container">{"< " + source.before.format(momentStrFormat)}</div>
              </div>
            )}
            <div className="event-location-container">{source.location}</div>
            <div className="event-description-container">{source.description}</div>
          </div>
        </div>
      );
    }
  });
  return EventCard;
});