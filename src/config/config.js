require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT || 3000, 
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    emailRedirectUrl: process.env.SUPABASE_EMAIL_REDIRECT_URL,
  },
};

module.exports = config;