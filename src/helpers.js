export const statues = {
  "BACKLOG": "💡 Ideation",
  "STARTED": "⏳ In progress",
  "COMPLETE": "✅ Complete",
  "CANCELLED": "⚠️ Cancelled",
  "DECOMISSIONED": "🚫 Decomissioned",
}

export const nameToSlug = (name) => {
  var returnValue = ""
  returnValue = name.replaceAll(" ", "_")
  returnValue = returnValue.toLowerCase()
  return returnValue
}