"use strict";

/* add 'chai' to the globals */
global.chai = require("chai");

/* install the 'as-promised' module for chai */
const promises = require("chai-as-promised");
chai.use(promises);

/* install the 'spies' module for chai */
const spies = require("chai-spies");
chai.use(spies);
