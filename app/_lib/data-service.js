import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";

/////////////
// GET

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching cabin:", error.message);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching cabin price:", error.message);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error("Error fetching cabins:", error.message);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  return data;
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching booking:", error.message);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId) {
  console.log(`Fetching bookings for guestId: ${guestId}`); // Logging guestId
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(name, image, regularPrice, discount)") // Ensure regularPrice is included
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Bookings could not get loaded");
  }

  // Calculate total price for each booking
  const bookingsWithTotalPrice = data.map((booking) => {
    const cabinPrice = booking.cabins?.regularPrice || 0;
    const numNights = booking.numNights || 1; // Default to 1 night if undefined
    const discount = booking.cabins?.discount || 0;

    const totalPrice = cabinPrice * numNights - discount; // Adjust this based on your discount logic

    return { ...booking, totalPrice }; // Add the totalPrice to the booking object
  });

  return bookingsWithTotalPrice;
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error("Error fetching booked dates:", error.message);
    throw new Error("Bookings could not get loaded");
  }

  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("Error fetching settings:", error.message);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error("Error creating guest:", error.message);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking) {
  console.log("Creating booking with data:", newBooking); // Logging newBooking
  const { data, error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.error("Error creating booking:", error.message);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating guest:", error.message);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating booking:", error.message);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("Error deleting booking:", error.message);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
