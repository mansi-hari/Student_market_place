import api from "./api"

export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData)

  // Handle both response structures
  const token = response.data.token || response.data.data?.token
  const user = response.data.user || response.data.data?.user

  if (token) {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
  }

  return response.data
}

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials)
    console.log("Auth service login response:", response.data)

    // Handle both response structures
    const token = response.data.token || response.data.data?.token
    const user = response.data.user || response.data.data?.user

    if (token && user) {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    }

    return response.data
  } catch (error) {
    console.error("Auth service login error:", error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me")
  return response.data
}

export const updateProfile = async (userData) => {
  const response = await api.put("/auth/me", userData)

  // Update stored user data
  const user = response.data.user || response.data.data
  if (user) {
    localStorage.setItem("user", JSON.stringify(user))
  }

  return response.data
}

export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/change-password", passwordData)
  return response.data
}


export const sellItem = async (itemData) => {
  const response = await api.post("/items/sell", itemData)

  // Handle both response structures
  const item = response.data.item || response.data.data?.item

  if (item) {
    localStorage.setItem("lastListedItem", JSON.stringify(item))
  }

  return response.data
}
export const fetchWishlist = async () => {
  const response = await api.get("/wishlist")

  // Handle both response structures
  const wishlistItems = response.data.items || response.data.data?.items

  return wishlistItems || []
}

export const addToWishlist = async (itemId) => {
  const response = await api.post("/wishlist/add", { itemId })

  return response.data
}

export const removeFromWishlist = async (itemId) => {
  const response = await api.delete(`/wishlist/remove/${itemId}`)

  return response.data
}
