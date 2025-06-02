// API service functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

// Types based on your backend models
export type PonudaDTO = {
  ponudaId?: number
  naziv: string
  opis: string
  ukCijenaFiksna: number
  kategorija: string
  cijenaPoOsobi: number
}

export type ProstorDTO = PonudaDTO & {
  adresa: string
  kapacitet: number
}

// Generic API error handling
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    // Handle empty responses (like DELETE)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Ponuda API functions
export const ponudaApi = {
  // Get all ponude
  getAll: (): Promise<PonudaDTO[]> => apiRequest<PonudaDTO[]>("/api/ponudas"),

  // Get single ponuda
  getById: (id: number): Promise<PonudaDTO> => apiRequest<PonudaDTO>(`/api/ponudas/${id}`),

  // Create new ponuda
  create: (ponuda: Omit<PonudaDTO, "ponudaId">): Promise<number> =>
    apiRequest<number>("/api/ponudas", {
      method: "POST",
      body: JSON.stringify(ponuda),
    }),

  // Update ponuda
  update: (id: number, ponuda: Omit<PonudaDTO, "ponudaId">): Promise<number> =>
    apiRequest<number>(`/api/ponudas/${id}`, {
      method: "PUT",
      body: JSON.stringify(ponuda),
    }),

  // Delete ponuda
  delete: (id: number): Promise<void> =>
    apiRequest<void>(`/api/ponudas/${id}`, {
      method: "DELETE",
    }),
}

// Prostor API functions
export const prostorApi = {
  // Get all prostori
  getAll: (): Promise<ProstorDTO[]> => apiRequest<ProstorDTO[]>("/api/prostors"),

  // Get single prostor
  getById: (id: number): Promise<ProstorDTO> => apiRequest<ProstorDTO>(`/api/prostors/${id}`),

  // Create new prostor
  create: (prostor: Omit<ProstorDTO, "ponudaId">): Promise<number> =>
    apiRequest<number>("/api/prostors", {
      method: "POST",
      body: JSON.stringify(prostor),
    }),

  // Update prostor
  update: (id: number, prostor: Omit<ProstorDTO, "ponudaId">): Promise<number> =>
    apiRequest<number>(`/api/prostors/${id}`, {
      method: "PUT",
      body: JSON.stringify(prostor),
    }),

  // Delete prostor
  delete: (id: number): Promise<void> =>
    apiRequest<void>(`/api/prostors/${id}`, {
      method: "DELETE",
    }),
}

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Neispravni podaci. Molimo provjerite unos."
      case 404:
        return "Traženi resurs nije pronađen."
      case 409:
        return "Resurs se ne može obrisati jer se koristi u drugim zapisima."
      case 500:
        return "Greška na serveru. Molimo pokušajte kasnije."
      default:
        return `Greška: ${error.message}`
    }
  }
  return "Neočekivana greška. Molimo pokušajte kasnije."
}
