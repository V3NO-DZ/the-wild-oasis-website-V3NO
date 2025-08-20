const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Type definitions
export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

export type Booking = {
  id: number;
  created_at: Date;
  startDate: Date;
  endDate: Date;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  observations?: string | null;
  extrasPrice: number;
  isPaid: boolean;
  hasBreakfast: boolean;
  status: string;
  cabin?: { name: string; image: string } | null;
};

export type Guest = {
  id?: number;
  email: string;
  fullName: string;
  nationality?: string;
  countryFlag?: string;
  nationalID?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type Settings = {
  id: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
  created_at: Date;
  updated_at: Date;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      // Handle 204 No Content responses (like DELETE operations)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Cabins
  async getCabins(): Promise<Cabin[]> {
    return this.request<Cabin[]>("/cabins");
  }

  async getCabin(id: string): Promise<{ cabin: Cabin; bookedDates: Date[] }> {
    return this.request<{ cabin: Cabin; bookedDates: Date[] }>(`/cabins/${id}`);
  }

  async createCabin(data: any): Promise<Cabin> {
    return this.request<Cabin>("/cabins", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCabin(id: string, data: any): Promise<Cabin> {
    return this.request<Cabin>(`/cabins/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCabin(id: string): Promise<Cabin> {
    return this.request<Cabin>(`/cabins/${id}`, {
      method: "DELETE",
    });
  }

  // Bookings
  async getBookings(guestId?: number): Promise<Booking[]> {
    const url = guestId ? `/bookings?guestId=${guestId}` : "/bookings";
    return this.request<Booking[]>(url);
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.request<Booking[]>("/bookings/all");
  }

  async getBooking(id: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`);
  }

  async createBooking(data: any): Promise<Booking> {
    return this.request<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBooking(id: string, data: any): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`, {
      method: "DELETE",
    });
  }

  // Guests
  async getGuests(): Promise<Guest[]> {
    return this.request<Guest[]>("/guests");
  }

  async getGuest(id: string): Promise<Guest> {
    return this.request<Guest>(`/guests/${id}`);
  }

  async getGuestByEmail(email: string): Promise<Guest> {
    return this.request<Guest>(`/guests?email=${encodeURIComponent(email)}`);
  }

  async createGuest(data: any): Promise<Guest> {
    return this.request<Guest>("/guests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGuest(id: string, data: any): Promise<Guest> {
    return this.request<Guest>(`/guests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteGuest(id: string): Promise<Guest> {
    return this.request<Guest>(`/guests/${id}`, {
      method: "DELETE",
    });
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return this.request<Settings>("/settings");
  }

  async updateSettings(data: any): Promise<Settings> {
    return this.request<Settings>("/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
