define(['react'], function(React){
  var PredictionList = React.createClass({
    render : function() {
      if (this.props.newPredictions.length == 0) {
        return (<div></div>);
      } else {
        return (
          <ul onClick={this.props.onLocationChoice} className="prediction-list no-list-style">
            {this.props.newPredictions.map(function(pred) {
                return (
                  <li key={pred.id} className="prediction-text">{pred.description}</li>
                );
              })
            }
          </ul>
        );
      }
    }
  });  
  return PredictionList;
});



