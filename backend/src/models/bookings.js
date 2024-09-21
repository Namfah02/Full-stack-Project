import { db } from "../database.js"

export function newBooking(
    id,
    created_datetime,
    user_id,
    class_id,
) {
    return {
        id,
        created_datetime,
        user_id,
        class_id,
    }
}

// Get all bookings
export async function getAll() {
    const [allbookingsResults] = await db.query("SELECT * FROM bookings")

    return await allbookingsResults.map(( bookingResult) =>
        newBooking(
            bookingResult.id.toString(),
            bookingResult.created_datetime,
            bookingResult.user_id,
            bookingResult.class_id,
        ))
}

// Get booking by booking ID
export async function getBookingByID(bookingId) {
    const [bookingsResults] = await db.query("SELECT * FROM bookings WHERE id = ?", bookingId)
  
    if (bookingsResults.length > 0) {
      const bookingResult = bookingsResults[0];
      return Promise.resolve(
        newBooking(
            bookingResult.id.toString(),
            bookingResult.created_datetime,
            bookingResult.user_id,
            bookingResult.class_id,
        )
      )
    } else {
      return Promise.reject("no results found");
    }
}

// Get booking by user ID
export async function getByUserID(userID) {
    const [bookingsResults] = await db.query("SELECT * FROM bookings WHERE user_id = ?", userID)
  
    return await bookingsResults.map((bookingResult) =>
        newBooking(
            bookingResult.id.toString(),
            bookingResult.created_datetime,
            bookingResult.user_id,
            bookingResult.class_id,
        )
  );
}

// Create booking
export async function create(booking) {
    delete booking.id

    return db.query(
        "INSERT INTO bookings (created_datetime, user_id, class_id) "
        + "VALUE (?, ?, ?)",
        [
            booking.created_datetime,
            booking.user_id,
            booking.class_id,
        ]
    ).then(([result]) => {
        return { ...booking, id: result.insertId }
    })
}

// Delete booking
export async function deleteByID(bookingID) {
    return db.query("DELETE FROM bookings WHERE id = ?", bookingID)
  }


// Get booking by user ID and class ID
export async function getByUserIdAndClassId(userID, classID) {
    const [bookingsResults] = await db.query("SELECT * FROM bookings WHERE user_id = ? and class_id = ?", [userID, classID])
  
    if (bookingsResults.length > 0) {
        const bookingResult = bookingsResults[0];
        return Promise.resolve(
          newBooking(
              bookingResult.id.toString(),
              bookingResult.created_datetime,
              bookingResult.user_id,
              bookingResult.class_id,
          )
        )
      } else {
        return null
      }
  }
  