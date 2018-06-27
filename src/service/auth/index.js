import Cookies from 'js-cookie'
import * as R from 'ramda'

export const clearAuthCookie = () => {
  try {
    Cookies.remove('web-session', {path: '/'})
  } catch (e) {
    console.log('clear cookie fail')
  }
}

export const getRolesInterNames = (roles, allRoles) => {
  const tenantRoles = []
  R.forEach(item => {
    if (item.auths) {
      tenantRoles.push(...item.auths)
    }
  })(roles || [])
  const inter = R.intersection(R.map(item => item.id)(tenantRoles), R.map(item => item.id)(allRoles))
  const interNames = []
  R.forEach(inId => {
    const auth = R.find(item => item.id === inId)(allRoles)
    if (auth) {
      interNames.push(auth.parent_name)
    }
  })(inter || [])
  return interNames
}

export const canUseRolesNames = (interNames, routeList) => {
  const routeTitles = []
  R.forEach(item => {
    routeTitles.push(item.meta.title)
  })(routeList || [])
  return R.intersection(interNames, routeTitles)
}

export const getAuthRoute = (routeList, roles, allRoles) => {
  let authName = ''
  if (roles && roles.length !== 0) {
    const interNames = getRolesInterNames(roles, allRoles)
    const canUseInterNames = canUseRolesNames(interNames, routeList)
    if (canUseInterNames && canUseInterNames.length > 0) {
      authName = canUseInterNames[0]
    }
  }
  let routeName = 'PageErr'
  if (authName) {
    for (let i = 0; i < routeList.length; i++) {
      if (routeList[i].meta.title === authName) {
        routeName = routeList[i].name
        break
      }
    }
  }
  return routeName
}

export const isAuthRouter = (toName, routeList, roles, allRoles) => {
  if (roles.length !== 0) {
    const interNames = getRolesInterNames(roles, allRoles)
    const canUseInterNames = canUseRolesNames(interNames, routeList)
    if (!canUseInterNames || canUseInterNames.length === 0) {
      return false
    }
    const toNameIndex = R.findIndex(item => item === toName)(canUseInterNames)
    return toNameIndex !== -1
  }
  return false
}
