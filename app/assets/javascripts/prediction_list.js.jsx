define(['react'], function(React){

  var PredictionList = React.createClass({
    getInitialState: function() {
      return {
      };
    },
    render : function() {
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
  });  
  return PredictionList;
});



