const supabase = require("../config/supabase");

const upsertProfile = async ({ id, email, full_name, role }) => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id,
        email: email || null,
        full_name: full_name || null,
        role,
      },
      { onConflict: "id" }
    )
    .select("id, role, email, full_name")
    .single();

  if (error) throw error;
  return data;
};

// Public customer signup (Supabase handles email verification)
const signUpCustomer = async ({ email, password, full_name }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name,
      },
      emailRedirectTo: process.env.SUPABASE_EMAIL_REDIRECT_URL || undefined,
    },
  });
  if (error) throw error;

  if (data && data.user && full_name) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      data.user.id,
      {
        user_metadata: { full_name },
      }
    );
    if (updateError) throw updateError;
  }

  if (data && data.user) {
    await upsertProfile({
      id: data.user.id,
      email: data.user.email,
      full_name: full_name || null,
      role: "customer",
    });
  }

  return data.user;
};

// Admin invite for pharmacist/admin
const inviteAuthUser = async ({ email, role }) => {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { role },
  });
  if (error) throw error;

  if (data && data.user && role) {
    await upsertProfile({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata && data.user.user_metadata.full_name,
      role,
    });
  }

  return data.user;
};

//Admin fetch Staff profiles
const getStaffUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, phone, full_name")
    .in("role", ["admin", "pharmacist"]);

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }

  console.log(data);

  return data;
};

// Login with email/password and return access token
const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const userId = data && data.user && data.user.id;
  const accessToken = data && data.session && data.session.access_token;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (profileError) throw profileError;

  if (!userId || !accessToken || !profile || !profile.role) {
    throw new Error("Authenticated user not found");
  }

  return { userId, accessToken, role: profile.role };
};


module.exports = {
  signUpCustomer,
  inviteAuthUser,
  getStaffUsers,
  loginUser,
};