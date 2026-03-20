export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]).{8,30}$/

export const PASSWORD_RULE_MESSAGE =
  'Password must include uppercase, lowercase, number, special character, and at least 8 characters.'

export function getApiErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  )
}

export function formatDate(value, options = {}) {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date)
}

export function formatDateTime(value) {
  return formatDate(value, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDateInput(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}

export function toIsoDateString(dateValue) {
  return `${dateValue}T00:00:00.000Z`
}

export function getInitials(name) {
  if (!name) {
    return 'AU'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function buildDisplayName(user) {
  if (user?.profile?.name) {
    return user.profile.name
  }

  if (user?.name) {
    return user.name
  }

  if (user?.email) {
    return user.email.split('@')[0]
  }

  return 'Unnamed User'
}

export function getUserPosition(user) {
  return user?.profile?.position?.trim() || 'Unassigned'
}

export function getUserGender(user) {
  return user?.profile?.gender || 'Other'
}

export function getUserSearchText(user) {
  return [
    buildDisplayName(user),
    user?.email,
    getUserPosition(user),
    user?.profile?.phoneNumber,
    user?.profile?.address,
    user?.profile?.idCardNumber,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function compareByNewest(a, b) {
  return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
}
