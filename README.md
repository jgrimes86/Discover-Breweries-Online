# Discover The MET Online

*The Metropolatian Museum of Art* has a extensive collection of artwork on display. This application will allow potential MET visitors to view some of the MET's works, find out details about the piece, search for styles of art based on the MET's departments, and save liked artwork. This application uses the MET's open **API** *https://collectionapi.metmuseum.org/public/collection/v1/objects*

This is a code project for Flatiron School's software engineering course. The authors of this project are [Jim Grimes](https://www.github.com/jgrimes86), and [Kevin J Stafford](https://www.github.com/kevinjstafford)


## Project Requirements

Your app must be a HTML/CSS/JS frontend that accesses data from a public API or from a db.json file using json-server. Your API or db.json should return a collection of at least 5 objects with each object having at least 3 attributes. All interactions between the client and the API should be handled asynchronously and use JSON as the communication format. Try to avoid using an API that requires a key. APIs that are free and require no authorization will be easiest to use. For ideas, see this list of no-auth APIsLinks to an external site.. If you would like to use an API that requires a key, please consult with your instructor on how to protect that key. NEVER push your API key to github!

Your entire app must run on a single page. There should be NO redirects or reloads. In other words, your project will contain a single HTML file.

Use at least 3 distinct event listenersLinks to an external site. (3 events of different types) that enable interactivity. What this means is that, if you had 3 click events, that would only count as 1 distinct event and you would need to add at least 2 more. Think search or filter functionality, toggling dark/light mode, upvoting posts, etc. Each of your event listeners should also have its own unique callback function. These must be added using JavaScript's .addEventListener() method. Events embedded into HTML elements and CSS will not count toward the total. Please ask your instructor if you have questions regarding this requirement.

Your project must implement at least one instance of array iteration using available array methods (map, forEach, filter, etc). Manipulating your API data in some way should present an opportunity to implement your array iteration.

Follow good coding practices. Keep your code DRY (Do not repeat yourself) by utilizing functions to abstract repetitive code.

### Stretch Goals
Use json-serverLinks to an external site. in your project to persist your app's interactivity.