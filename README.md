## Persona Maps

Current software projects are driven by the need to satisfy the requirements of a specific end user, described by a 'Persona'. Different Personas may interact with a product in different ways, and consequently their perception of the product may reflect this.

Product quality, observed at a high level and abstract view, has become important for gaining an insight into where focus must be applied to achieve the greatest net result. Historically this has been applied to a complete product using 'confidence maps', which aim to abstract a product into weighted functional components that have confidence values attibuted to each component. From this a high level picture of the product quality can be observed using a treemap diagram; this is ideal for rapidly conveying the current product quality and consequently where to focus effort to improve the product. 

Persona mapping takes the concept of confidence mapping, and applies it to a set of Personas that interact with the same product from different perspectives. A trivial example of this would be differentiating between a new user to a product and a power-user: the new user will be interested in documentation, tutorials and basic function; a power-user would not care about tutorial aspects, be moderately concerned with API documentation, and be primarily concerned with stability and performance. A single confidence map would not be able to differentiate between these disparate needs.

By using Persona maps, it is possible to generate more insight into the quality of product via the Personas that you are serving and primarily enables moving the delivery focus from the product to the Persona. It is hoped that by doing so, the end users of the product become the driving factor behind future efforts.

### Usage
- Clone or fork this repository
- Make sure you have [node.js](https://nodejs.org/) installed version 6+
- Make sure you have NPM installed version 4.5+
- `WINDOWS ONLY` run `npm install -g webpack webpack-dev-server typescript` to install global dependencies
- run `npm install` to install dependencies
- run `npm server:prod` to build and run the project
- run `npm start` to start the dev server and then open browser to [`http://localhost:3000`](http://localhost:3000)
- run `npm test` to run the test suite

### Overview and Operation

A product is considered divisible into functional components that we name 'Aspects'. A 'Persona' interacts with the product, and may or may not be interested/impacted by a product Aspect.
- Each Aspect has a confidence value associated with its percieved quality; this value may be derrived form factors such as test code coverage, performance statistics or issues raised.
- Each Persona is named and may be linked to an existing Aspect via a weighting that is indicative of the importance of that aspect to them; in implementation do consider that if everything is essential, then nothing is essential.

Having launched the Persona Maps Application:
- Input the product aspects in the 'Aspects' tab of the UI. Each Aspect will require a unique name, and a confidence value provided by a dropdown.
- Define one or more Personas in the 'Persona' tab of the UI. Each defined Persona will require a unique name.
- Associate defined Aspects with each Persona, providing a Persona specific weighting to the Aspect. It is anticipate that in most cases, these weightings for Aspects will differ between Personas.
- Navigation to the 'Maps' tab of the UI will display a confidence map for each defined Persona.

Export and Import of persona maps is possible through the mapping page, as a persona-mapping.psm file.