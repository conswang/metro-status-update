const User = require('./user.model.js')
const Routes = require('./route.model.js')

let addUser = (number, routeList) => {
  User.create({phoneNumber: number, routes: routeList})
}

let getRoutes = (userPhoneNumber) => {
  return User.findOne({phoneNumber: userPhoneNumber})
  .then(
    user => {
      console.log("User Routes:" + user.routes)
      // TODO: do stuff with user routes
      return user.routes
    }
  )
}

let getRouteStatus = (routeNumber) => {
  Routes.findOne({number: routeNumber})
  .then(
    route => {
      console.log("Route Status: " + route.status)
      // TODO: stuff with route status
      return route.status
    }
  )
}

let addRoute = (routeNumber, routeStatus) => {
  Routes.create({number: routeNumber, status: routeStatus})
}

let setRouteStatus = (routeNumber, routeStatus) => {
  Routes.findOne({number: routeNumber})
  .then(
    route => {
      route.status = routeStatus
      route.save()
    }
  )
}

module.exports.addUser = addUser
module.exports.getRoutes = getRoutes
module.exports.getRouteStatus = getRouteStatus
module.exports.addRoute = addRoute
module.exports.setRouteStatus = setRouteStatus