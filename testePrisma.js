const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function main(){
    //Insert de Usuário
    const novoUsuario = await prisma.usuario.create({
        data:{
            nome: "Jubilee",
            email: "jubilee@gmail.com",
        },
    });

    console.log("Novo Usuário:" + JSON.stringify (novoUsuario));
}

main()