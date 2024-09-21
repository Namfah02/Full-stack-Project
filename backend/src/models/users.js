import { db } from "../database.js";

export function newUser(
  id,
  firstName,
  lastName,
  role,
  email,
  password,
  phone,
  address,
  authenticationKey
) {
  return {
    id,
    firstName,
    lastName,
    role,
    email,
    password,
    phone,
    address,
    authenticationKey,
  };
}

// Get all users
export async function getAll() {
  const [allUserResults] = await db.query("SELECT * FROM users");

  return await allUserResults.map((userResult) =>
    newUser(
      userResult.id.toString(),
      userResult.firstname,
      userResult.lastname,
      userResult.role,
      userResult.email,
      userResult.password,
      userResult.phone,
      userResult.address,
      userResult.authentication_key
    )
  );
}

//Get user by ID
export async function getUserByID(userID) {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE id = ?",
    userID
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
      newUser(
        userResult.id.toString(),
        userResult.firstname,
        userResult.lastname,
        userResult.role,
        userResult.email,
        userResult.password,
        userResult.phone,
        userResult.address,
        userResult.authentication_key
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

//Get user name by id
export async function getUsernameByID(userID) {
  const [userResults] = await db.query(
    "SELECT id, firstname, lastname FROM users WHERE id = ?",
    userID
  );

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve({
      id: userResult.id,
      firstname: userResult.firstname,
      lastname: userResult.lastname
    });
  } else {
    return Promise.reject("No results found");
  }
}

//Get user by trainers role
export async function getUsersByRole(role) {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE role = ?",
    role
  );

  if (userResults.length > 0) {
    const users = userResults.map(userResult => newUser(
      userResult.id.toString(),
      userResult.firstname,
      userResult.lastname,
      userResult.role,
      userResult.email,
      userResult.password,
      userResult.phone,
      userResult.address,
      userResult.authentication_key
    ));
    return Promise.resolve(users);
  } else {
    return Promise.reject("No users found with the specified role");
  }
}

// Get user by Authentication Key
export async function getByAuthenticationKey(authenticationKey) {
  const [userResults] = await db.query(
    "SELECT * FROM users WHERE authentication_key = ?",
    authenticationKey
  );

  if (userResults.length > 0) {
    const userResult = userResults[0]
    return Promise.resolve(
      newUser(
        userResult.id.toString(),
        userResult.firstname,
        userResult.lastname,
        userResult.role,
        userResult.email,
        userResult.password,
        userResult.phone,
        userResult.address,
        userResult.authentication_key,
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

// Create new user
export async function create(user) {
  delete user.id;

  return db
    .query(
      "INSERT INTO users (firstname, lastname, role, email, password, phone, address) " +
        "VALUE (?, ?, ?, ?, ?, ?, ?)",
      [
        user.firstName,
        user.lastName,
        user.role,
        user.email,
        user.password,
        user.phone,
        user.address,
      ]
    )
    .then(([result]) => {
      return { ...user, id: result.insertId };
    });
}

// Update user
export async function update(user) {
  return db
    .query(
      "UPDATE users SET " +
        "firstname = ?, " +
        "lastname = ?, " +
        "role = ?, " +
        "email = ?, " +
        "password = ?, " +
        "phone = ?, " +
        "address = ?, " +
        "authentication_key = ? " +
        "WHERE id = ?",
      [
        user.firstName,
        user.lastName,
        user.role,
        user.email,
        user.password,
        user.phone,
        user.address,
        user.authenticationKey,
        user.id,
      ]
    )
    .then(([result]) => {
      return { ...user, id: result.insertId };
    });
}

// Get user by email
export async function getByEmail(email) {
  const [userResults] = await db.query("SELECT * FROM users WHERE email = ?", email);

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
      newUser(
        userResult.id.toString(),
        userResult.firstname,
        userResult.lastname,
        userResult.role,
        userResult.email,
        userResult.password,
        userResult.phone,
        userResult.address,
        userResult.authentication_key
      )
    );
  } else {
    null
  }
}

// Get user by name
export async function getByName(firstName, lastName) {
  const [userResults] = await db.query("SELECT * FROM users WHERE firstname = ? and lastname = ?", [firstName, lastName]);

  if (userResults.length > 0) {
    const userResult = userResults[0];
    return Promise.resolve(
    newUser(
      userResult.id.toString(),
      userResult.firstname,
      userResult.lastname,
      userResult.role,
      userResult.email,
      userResult.password,
      userResult.phone,
      userResult.address,
      userResult.authentication_key
    )
  )
  } else {
    return Promise.reject("no user was found");
  }
}
