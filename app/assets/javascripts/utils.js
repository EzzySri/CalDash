define([], function(){
  return {
    customIndexOf: function(arr, f) {
      for(var i=0; i<arr.length; ++i)
      {
          if( f(arr[i]) )
              return arr[i];
      }
      return null;
    }
  };
});