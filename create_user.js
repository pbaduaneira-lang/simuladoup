const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sosqfvynxtdhbrhgnhce.supabase.co';
const supabaseKey = 'sb_publishable_ylktM43AK48uAORdAiAs6Q_T7gxEDae';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  console.log("Tentando criar usuário no Supabase...");
  const { data, error } = await supabase.auth.signUp({
    email: 'edmilton@gmail.com',
    password: '123456',
    options: {
      data: {
        nomeCompleto: 'Edmilton',
        ondeEstuda: 'SimuladoUp',
        cidade: 'Curitiba',
        endereco: 'Rua X',
        telefone: '41999999999'
      }
    }
  });

  if (error) {
    console.error("Erro no Supabase:", error.message);
    return;
  }

  console.log("Usuário criado no Supabase! ID:", data.user?.id);

  console.log("Registrando no banco local (Prisma)...");
  try {
    const res = await fetch("http://localhost:3005/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: data.user.id,
        email: 'edmilton@gmail.com',
        nomeCompleto: 'Edmilton',
        ondeEstuda: 'SimuladoUp',
        cidade: 'Curitiba',
        endereco: 'Rua X',
        telefone: '41999999999'
      })
    });
    
    const result = await res.json();
    if (result.error) {
      console.error("Erro no Prisma:", result.error);
    } else {
      console.log("Conta criada com sucesso! Pode logar.");
    }
  } catch (err) {
    console.error("Erro ao chamar a API local. O servidor dev (npm run dev) está rodando no 3005?", err);
  }
}

createUser();
