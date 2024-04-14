export const toLink = (text) => text.toLowerCase().replace(/\s+/g, '-')
export const toTitleCase = (text) => text.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
export const toLower = (text) => text.toLowerCase().split("-").join(" ")