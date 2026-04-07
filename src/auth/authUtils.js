export const normalizeAuthRole = (role) => {
  const normalizedRole = String(role ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')

  if (!normalizedRole) {
    return null
  }

  if (normalizedRole.startsWith('client') || normalizedRole === 'personal') {
    return 'client'
  }

  if (
    normalizedRole.startsWith('bank') ||
    ['banker', 'bank_employee', 'bankemployee'].includes(normalizedRole)
  ) {
    return 'banker'
  }

  return null
}

export const resolveAuthRole = (...candidates) => {
  for (const candidate of candidates) {
    const normalizedRole = normalizeAuthRole(candidate)

    if (normalizedRole) {
      return normalizedRole
    }
  }

  return null
}

export const sanitizeAuthUser = (user, fallbackRole = null) => {
  if (!user || typeof user !== 'object' || Array.isArray(user)) {
    return null
  }

  const {
    password: _password,
    refreshToken: _refreshToken,
    accessToken: _accessToken,
    __v,
    ...safeUser
  } = user

  const normalizedRole = resolveAuthRole(safeUser.role, fallbackRole)

  if (normalizedRole) {
    safeUser.role = normalizedRole
  }

  return safeUser
}
