# CalDash
CS294 Web Application

Everyday we have mandatory events and flexible events. Mandatory events can be things like class, meetings, or work which requires us to be in a specific place at a specific time. Flexible events, well, are more flexbile. We know we want to get lunch, but we dont care when we get lunch as long as its between 11 to 2. This application is a calendar app manages your flexbile and mandatory events and finds the best schedule for your flexbile events that minimizes your walking distance throughout the day. 

Stack:

  - Ruby 2.2.0
  - Rails 4.2.0
  - React/Flux for frontend
  - Heroku for deployment

We use Ruby 2.2.0. We also use RVM to manage ruby environments. This is highly recommneded. 
Install RVM and then run the following commands to setup your ruby environment:
    
    rvm install 2.2.0
    rvm --ruby-version use 2.2.0 
    rvm gemset create GEMSET_NAME
    rvm --ruby-version use 2.2.0@GEMSET_NAME

To install:
  
    bundle install
    rake db:setup

To run:
    
    rails s
