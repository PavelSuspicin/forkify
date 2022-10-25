export const JSON = async function (url) {
  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!res.ok) throw new Error(`${data.massage} (${res.status})`)
  } catch (error) {
    console.error(error)
  }
}
