# CO<sub>2</sub> \@ Georgia Tech

### v0.1.0 (2019-04-19)

#### Features
 * Can view data regarding Georgia Tech's carbon footprint via air travel in graphs
 * Multiple graphs present information in different contexts
 * Using the date selector, you can view the data during a specific time period
 * The department selector allows user to filter the information by Georgia Tech's departments
 * You can hover over "about this chart" to reveal more information regarding the respective chart
 * You can send feedback using the "send feedback" button

#### Upcoming Features
 * About page will better explain the data that is used

#### Bug Fixes
n/a

#### Known issues
 * Date and Department selectors currently unresponsive
 * Charts not using the full width of the screen on wider monitors
 * Some formatting issues on mobile
 * "About this chart" not working on mobile
 * Legend isn't readable for some graphs
 * Equivalance information isn't present for the Total CO<sub>2</sub> graph

## Installation
### Pre-requisites
 * A web browser with JS ES6 support

### Downloading
 * `git clone git@github.com:oselcuk/co2-gatech.git` or [download the repo](https://github.com/oselcuk/co2-gatech/archive/master.zip) and unzip.

### Deployment
 * Set the `API_URL` variable in [javascript.js](static/javascript.js) to a running instance of [the API](https://github.com/oselcuk/co2-gatech-server).
   * Note: If using with an API instance running on a different host, make sure to enable CORS either on the API side or in the browser you're testing on.
 * Open [index.html](index.html) in your preferred browser.

#### Deployment with the back-end
Refer to the [Deployment with the frontend section of the API README](https://github.com/oselcuk/co2-gatech-server/blob/master/README.md#deployment-with-the-frontend) for instructions.