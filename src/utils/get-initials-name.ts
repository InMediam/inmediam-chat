interface GetInitialsNameParams {
  name: string
}

export function getInitialsName({ name }: GetInitialsNameParams) {
  if (!name) return ''
  const [firstName, lastName] = name.split(' ')
  const firstInitial = firstName ? firstName[0].toUpperCase() : ''
  const lastInitial = lastName ? lastName[0].toUpperCase() : ''
  return `${firstInitial}${lastInitial}`
}
