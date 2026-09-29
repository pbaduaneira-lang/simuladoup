const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sosqfvynxtdhbrhgnhce.supabase.co';
const supabaseKey = 'sb_publishable_ylktM43AK48uAORdAiAs6Q_T7gxEDae';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log("Tentando logar no Supabase com edmilton@gmail.com / 123456...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'edmilton@gmail.com',
    password: '123456',
  });

  if (error) {
    console.error("Erro ao logar:", error.message);
  } else {
    console.log("Logado com sucesso! Token:", data.session?.access_token.substring(0, 20) + "...");
  }
}

testLogin();
