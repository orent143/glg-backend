const supabase = require("../config/supabase");

// Fetch all users
const fetchAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

// Add a new user
const addUser = async (user) => {
  const { data, error } = await supabase.from("users").insert([user]);
  if (error) throw error;
  return data;
};

// Public customer signup (Supabase handles email verification)
const signUpCustomer = async ({ email, password, fullName }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname: fullName,
      },
      emailRedirectTo: process.env.SUPABASE_EMAIL_REDIRECT_URL || undefined,
    },
  });
  if (error) throw error;
  return data.user;
};

// Admin invite for pharmacist/admin
const inviteAuthUser = async ({ email, role }) => {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { role },
  });
  if (error) throw error;

  if (data && data.user && role) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      data.user.id,
      {
        app_metadata: { role },
      }
    );
    if (updateError) throw updateError;
  }

  return data.user;
};


module.exports = {
  fetchAllUsers,
  addUser,
  signUpCustomer,
  inviteAuthUser,
};